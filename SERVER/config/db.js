// config/db.js
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
console.log("DB URI:", process.env.DB_URI);


export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_URI );
    console.log("MongoDB connected:", conn.connection.host);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};
