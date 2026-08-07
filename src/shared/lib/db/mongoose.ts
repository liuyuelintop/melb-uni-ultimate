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
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(
      "Missing MONGODB_URI. Set it in your deployment's environment variables, " +
        "or in .env.local for local development."
    );
  }

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
