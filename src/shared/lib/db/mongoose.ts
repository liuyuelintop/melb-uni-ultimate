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

  return uri;
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
