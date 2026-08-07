import { MongoClient } from "mongodb";

const globalWithMongo = global as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
};

/**
 * Lazily create (and cache) the MongoClient connection promise.
 *
 * This used to run at module scope and threw on a missing MONGODB_URI. Because
 * `src/shared/lib/auth/options.ts` imports this file, and every route handler
 * imports the auth guards, that top-level throw sat in the dependency graph of
 * the whole API — so `next build` could not collect page data without a
 * database credential. Nothing here touches the environment until it is called.
 *
 * `new MongoClient()` does not open a socket; `connect()` does. The promise is
 * cached on `global` so repeated calls in a serverless runtime reuse one client
 * instead of exhausting the connection pool.
 */
export function getClientPromise(): Promise<MongoClient> {
  if (globalWithMongo._mongoClientPromise) {
    return globalWithMongo._mongoClientPromise;
  }

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(
      'Invalid/Missing environment variable: "MONGODB_URI"'
    );
  }

  const client = new MongoClient(uri, {});
  globalWithMongo._mongoClientPromise = client.connect();

  return globalWithMongo._mongoClientPromise;
}
