import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = function connection() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("MONGO_URI is required");
  }
  return mongoose
    .connect(uri)
    .then(() => console.log("MongoDB connected successfully"))
    .catch((err) => console.error("MongoDB connection failed:", err));
};

export default connectDB;
