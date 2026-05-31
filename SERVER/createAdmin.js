import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/users.model.js";

dotenv.config();

const createAdmin = async () => {
  try {
    // חיבור ל-DB
    await mongoose.connect(process.env.DB_URI);
    console.log("MongoDB connected");

    // מחיקה אם קיים כבר
    await User.deleteMany({ email: "cs@gmail.com" });

    const plainPassword = "12345678";

    // יצירת מנהל חדש עם הסיסמה הגולמית בלבד
    const admin = new User({
      name: "Shifi Z.",
      email: "cs@gmail.com",
      companyName: "cs",
      role: "Manager",
      password: plainPassword, // לא עושים hash כאן!
      profileImage: "/uploads/shifi.jpg" // כאן את מוסיפה את התמונה
    });

    await admin.save();
    console.log("✅ Admin created!");

    // בדיקה מיידית
    const user = await User.findOne({ email: "cs@gmail.com" }).select("+password");
    const match = await bcrypt.compare(plainPassword, user.password);
    console.log("Password matches?", match); // חייב להחזיר true

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (err) {
    console.error("Error:", err);
    mongoose.disconnect();
  }
};

createAdmin();
