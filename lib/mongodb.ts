/*import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

type GlobalThisType = typeof globalThis;

interface GlobalWithMongoose extends GlobalThisType {
  mongoose?: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
}

const globalWithMongoose = global as GlobalWithMongoose;
let cached = globalWithMongoose.mongoose;

if (!cached) {
  cached = (global as GlobalWithMongoose).mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
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

export default connectToDatabase;
*/
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Extend the NodeJS.Global interface to include the mongoose property
declare global {
  namespace NodeJS {
    interface Global {
      mongoose: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
      };
    }
  }
}

// Use a cached global variable to prevent multiple connections in development
let cached = (global as typeof global & { mongoose?: NodeJS.Global['mongoose'] }).mongoose || { conn: null, promise: null };

(global as typeof global & { mongoose: NodeJS.Global['mongoose'] }).mongoose = cached;

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongooseInstance) => mongooseInstance);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDatabase;