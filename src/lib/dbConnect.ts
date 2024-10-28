import mongoose, { Connection, Mongoose } from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "default-mongo-uri";
console.log("MONGO_URI", MONGO_URI);

if (!MONGO_URI) {
  throw new Error("Please define the MONGO_URI environment variable");
}

// Declare a global type for caching the mongoose connection
declare const global: {
  mongoose: { conn: Connection | null; promise: Promise<Mongoose> | null };
};

// Use global caching for Mongoose connection
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect(): Promise<Connection> {
  if (cached.conn) {
    console.log("Connected to MongoDB from cache");
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGO_URI, opts).then((mongoose) => {
      console.log("Connected to MongoDB");
      return mongoose;
    });
  }

  cached.conn = (await cached.promise).connection;
  return cached.conn;
}

export default dbConnect;
