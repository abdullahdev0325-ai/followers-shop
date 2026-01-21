import mongoose from "mongoose";

const MONGO_URI = process.env.DATABASE_URL;

// connection options (safe defaults)
const options = {
  autoIndex: false,          // production best practice
  maxPoolSize: 10,           // similar to PG pool max
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
};

// Reuse connection in development (Next.js / nodemon safe)
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGO_URI, options)
      .then((mongoose) => {
        console.log("✅ MongoDB connected");
        return mongoose;
      })
      .catch((err) => {
        console.error("❌ MongoDB connection error:", err.message);
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

// Graceful error handling
mongoose.connection.on("error", (err) => {
  console.error("MongoDB runtime error:", err.message);
});

mongoose.connection.on("disconnected", () => {
  console.warn("⚠ MongoDB disconnected");
});
