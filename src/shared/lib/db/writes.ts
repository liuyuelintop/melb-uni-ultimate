import { NextResponse } from "next/server";
import { DatabaseConfigError } from "./mongoose";

/**
 * Keep only the fields that were actually supplied, trimming strings.
 *
 * Mongoose stores an empty string as an empty string and an explicit null as
 * null, and **a unique index treats every null as the same value** — so the
 * second document that leaves an optional field empty collides with the first.
 * Omitting the key leaves the field absent, which is both truthful and the only
 * form a sparse index will skip.
 *
 * ```ts
 * new Player({ name, email, ...optional({ studentId, phoneNumber }) })
 * ```
 */
export function optional(
  fields: Record<string, unknown>
): Record<string, unknown> {
  const out: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined || value === null) continue;

    if (typeof value === "string") {
      const trimmed = value.trim();
      if (!trimmed) continue;
      out[key] = trimmed;
      continue;
    }

    out[key] = value;
  }

  return out;
}

/**
 * Build an update from named fields, distinguishing "not supplied" from
 * "deliberately cleared".
 *
 * An update has a third case a create does not. On a create a field is either
 * given or absent; on an update it can also be *blanked*, and the two look
 * identical in JSON unless you decide what each means:
 *
 * - **absent** (`undefined`) — leave whatever is stored alone
 * - **blank** (`""` or `null`) and listed in `clearable` — `$unset` it
 * - **blank** and not clearable — ignored; the schema's own validators own it
 * - **anything else** — `$set` it, trimming strings
 *
 * Clearing uses `$unset` rather than storing `null` for the same reason
 * {@link optional} omits rather than nulls: **a unique index treats every null
 * as the same value**, so two records whose studentId was cleared would collide
 * with each other. `$unset` removes the field, which is the only state a sparse
 * or partial index skips.
 *
 * Callers pass an explicit field list, never a spread request body. That is what
 * keeps `createdBy`, `createdAt` and `_id` out of reach, and it is also why a
 * `__proto__`-prefixed dotted path from a caller cannot reach the update: the
 * keys are the route's, only the values come from the request.
 *
 * ```ts
 * const update = buildUpdate(
 *   { name, email, studentId, phoneNumber },
 *   ["studentId", "phoneNumber"]
 * );
 * ```
 */
export function buildUpdate(
  fields: Record<string, unknown>,
  clearable: readonly string[] = []
): Record<string, unknown> {
  const set: Record<string, unknown> = {};
  const unset: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined) continue;

    const blank =
      value === null || (typeof value === "string" && value.trim() === "");

    if (blank) {
      if (clearable.includes(key)) unset[key] = "";
      continue;
    }

    set[key] = typeof value === "string" ? value.trim() : value;
  }

  const update: Record<string, unknown> = {};
  if (Object.keys(set).length > 0) update.$set = set;
  if (Object.keys(unset).length > 0) update.$unset = unset;

  return update;
}

/**
 * The field and value behind a duplicate-key rejection (MongoDB error 11000), or
 * null if this is not one. `keyPattern` names the index's fields and `keyValue`
 * holds the values that collided.
 */
export function duplicateKey(
  error: unknown
): { field: string; value: unknown } | null {
  if (!(error instanceof Error)) return null;

  const e = error as Error & {
    code?: number;
    keyPattern?: Record<string, unknown>;
    keyValue?: Record<string, unknown>;
  };

  if (e.code !== 11000) return null;

  const field = e.keyPattern ? Object.keys(e.keyPattern)[0] : undefined;
  if (!field) return null;

  return { field, value: e.keyValue ? e.keyValue[field] : undefined };
}

/**
 * Connection-level failures, as opposed to a rejected document.
 *
 * A name check alone is not enough: a failed SRV lookup — the usual symptom of a
 * wrong or paused Atlas cluster — rejects with a **plain** `Error` whose message
 * is `querySrv ENOTFOUND ...`, while a refused socket rejects with
 * `MongooseServerSelectionError`. Both are checked, along with the DNS and
 * socket codes.
 *
 * `MongoServerError` is deliberately excluded: it means the server answered and
 * rejected the operation — a duplicate key, for instance — which is not a
 * connectivity problem and should not be reported as one.
 */
export function isConnectionError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;

  if (error.name.startsWith("Mongo") && error.name !== "MongoServerError") {
    return true;
  }

  const code = (error as NodeJS.ErrnoException).code;
  if (
    code &&
    [
      "ENOTFOUND",
      "ECONNREFUSED",
      "ETIMEDOUT",
      "EAI_AGAIN",
      "ENETUNREACH",
    ].includes(code)
  ) {
    return true;
  }

  return /querySrv|ENOTFOUND|ECONNREFUSED|ETIMEDOUT/.test(error.message);
}

/**
 * Map a write failure onto a response, or return null when the cause is not one
 * of the ones worth distinguishing and the caller should fall back to its own
 * 500.
 *
 * The point is to stop answering an operator's misconfiguration with a message
 * that sends the user back to re-check the form they filled in correctly. Each
 * branch reports whose problem it is:
 *
 * - 503 — the deployment is misconfigured or the database is unreachable
 * - 503 — a unique index is rejecting an empty value, which the caller cannot
 *         influence at all
 * - 409 — a value the caller actually submitted is already taken
 *
 * @param subject singular noun for the record, used in the 409 message
 */
export function writeFailureResponse(
  error: unknown,
  subject = "record"
): NextResponse | null {
  if (error instanceof DatabaseConfigError) {
    return NextResponse.json({ error: error.message }, { status: 503 });
  }

  const duplicate = duplicateKey(error);
  if (duplicate) {
    // A collision on null means a unique index exists on a field this request
    // left empty — every empty value counts as the same one. The caller supplied
    // nothing for it, so blaming their input would be wrong.
    if (duplicate.value === null || duplicate.value === undefined) {
      return NextResponse.json(
        {
          error:
            `A unique index on "${duplicate.field}" is rejecting this write, ` +
            `because that field was left empty and another document already has ` +
            `it empty. A unique index treats every empty value as the same ` +
            `value. If the schema does not ask for "${duplicate.field}" to be ` +
            `unique, the index is left over from an earlier version of it — ` +
            `drop it, or recreate it as a partial index that skips documents ` +
            `where the field is absent.`,
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: `A ${subject} with this ${duplicate.field} already exists.` },
      { status: 409 }
    );
  }

  if (isConnectionError(error)) {
    return NextResponse.json(
      {
        error:
          "Could not reach the database. If this persists, check that the " +
          "cluster is running and that the deployment is allowed to connect to it.",
      },
      { status: 503 }
    );
  }

  return null;
}
