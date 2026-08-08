import mongoose from "mongoose";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

/** Raised when MONGODB_URI is absent or is not a MongoDB connection string. */
export class DatabaseConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DatabaseConfigError";
  }
}

/**
 * Validate MONGODB_URI and clean up the two ways pasting it into a dashboard
 * goes wrong: surrounding quotes and stray whitespace. Vercel stores the value
 * literally, so pasting `"mongodb+srv://..."` with the quotes yields a scheme of
 * `"mongodb+srv`, and the driver rejects it with a bare `MongoParseError:
 * Invalid scheme` that names neither the variable nor the deployment.
 *
 * The error below names the variable and reports the scheme it actually found,
 * which is what makes the mistake obvious — usually that the variable holds
 * something else entirely, such as an https:// URL. Only the scheme is quoted,
 * never the rest of the value, which carries the credentials.
 */
function normalizeUri(raw: string | undefined): string {
  if (!raw || !raw.trim()) {
    throw new DatabaseConfigError(
      "MONGODB_URI is not set. Add it to your deployment's environment " +
        "variables — and if this is a preview or branch deployment, check that " +
        "the variable is enabled for that environment too, not only production."
    );
  }

  let uri = raw.trim();

  // Strip one matching pair of surrounding quotes, a common paste artefact.
  if (
    (uri.startsWith('"') && uri.endsWith('"')) ||
    (uri.startsWith("'") && uri.endsWith("'"))
  ) {
    uri = uri.slice(1, -1).trim();
  }

  if (!uri.startsWith("mongodb://") && !uri.startsWith("mongodb+srv://")) {
    const scheme = uri.split("://")[0];
    const found =
      scheme && scheme.length < 24 && scheme !== uri
        ? `a value beginning "${scheme}://"`
        : "a value with no recognisable scheme";

    throw new DatabaseConfigError(
      `MONGODB_URI must begin with "mongodb://" or "mongodb+srv://", but holds ` +
        `${found}. Check that the variable contains the database connection ` +
        `string and not some other value, and that no quotes were included ` +
        `when it was pasted.`
    );
  }

  requireDatabaseName(uri);

  return uri;
}

/**
 * Refuse a connection string that names no database.
 *
 * Atlas's "Connect" dialog hands you a URI ending `/?appName=...` — an **empty**
 * path. That URI is completely valid and connects fine, but the driver then falls
 * back to a database literally called `test`, so the application silently reads
 * and writes the wrong place. The symptom is maddening rather than obvious: sign
 * up and log in work, because the user is created and read in `test`, while every
 * content page is empty, because the real data is in the intended database. It
 * cost hours to find once, so it is an error here rather than a default.
 *
 * The name goes between the host and the `?`:
 *   mongodb+srv://user:pass@host/  →  mongodb+srv://user:pass@host/my-database
 */
function requireDatabaseName(uri: string): void {
  const afterScheme = uri.slice(uri.indexOf("://") + 3);
  const slash = afterScheme.indexOf("/");
  const path =
    slash === -1 ? "" : afterScheme.slice(slash + 1).split("?")[0].trim();

  if (path) {
    return;
  }

  throw new DatabaseConfigError(
    "MONGODB_URI names no database. The path after the host is empty, and the " +
      'MongoDB driver then defaults to a database called "test" — so the app ' +
      "would read and write there instead of your real data. Add the database " +
      'name between the host and the "?", for example ' +
      '"mongodb+srv://user:pass@host/my-database?retryWrites=true". Atlas\'s ' +
      "Connect dialog omits it."
  );
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  // Read and validate the URI here rather than at module scope. `next build`
  // imports every route module to collect page data, so a top-level throw made
  // the build itself require a database credential — a missing MONGODB_URI
  // failed the build with "Failed to collect page data" instead of failing the
  // request that actually needs a database. Deferring it means the build only
  // needs code, and a misconfigured deployment reports the problem on the first
  // request that touches the database.
  const uri = normalizeUri(process.env.MONGODB_URI);

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(uri, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
