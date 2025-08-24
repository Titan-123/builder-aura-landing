import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectDB() {
  // If no MongoDB URI provided, run in mock mode
  if (!MONGODB_URI || MONGODB_URI === "") {
    console.log("🔄 No MongoDB URI provided, running in mock data mode");
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI!, opts)
      .then((mongoose) => {
        console.log("✅ Connected to MongoDB");
        return mongoose;
      })
      .catch((error) => {
        console.error("❌ Failed to connect to MongoDB:", error.message);
        console.log("🔄 Continuing with mock data fallback...");
        cached.promise = null;
        return null;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    console.error("❌ Database connection failed:", (e as Error).message);
    console.log("🔄 Using mock data instead...");
    cached.promise = null;
    cached.conn = null;
    // Don't throw error, return null to indicate mock mode
    return null;
  }

  return cached.conn;
}

export default connectDB;
