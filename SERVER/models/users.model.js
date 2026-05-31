import mongoose, { Schema, model } from "mongoose";
import Joi from "joi";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ------------------------
// סכמה של משתמש
// ------------------------
const userSchema = new Schema({
  name: { type: String, required: true, minlength: 2 },
  password: { type: String, required: true, minlength: 8 },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ["Manager", "TeamLead", "Employee"], required: true },
  teamCode: { type: String },          // קוד צוות
  teamName: { type: String },          // שם צוות
  manager: { type: mongoose.Schema.Types.ObjectId, ref: "User" },   // למי אני כפופה
  teamLead: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // ראש הצוות אם אני Employee
  profileImage: { type: String, default: "" }
}, { timestamps: true });

// ------------------------
// Hash סיסמה לפני שמירה
// ------------------------
userSchema.pre("save", async function() {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
  }
});

// ------------------------
// אינדקס ייחודי רק ל-TeamLead
// ------------------------
userSchema.index(
  { teamCode: 1 },
  { unique: true, partialFilterExpression: { role: "TeamLead" } }
);

// ------------------------
// Joi ולידציה
// ------------------------
export const validateUser = {
  register: Joi.object({
    name: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    confirmPassword: Joi.ref("password"),
    role: Joi.string().valid("Manager", "TeamLead", "Employee").required(),
    teamCode: Joi.when("role", {
      is: Joi.valid("TeamLead", "Employee"),
      then: Joi.string().required(),
      otherwise: Joi.forbidden()
    }),
    teamName: Joi.when("role", {
      is: Joi.valid("TeamLead", "Employee"),
      then: Joi.string().required(),
      otherwise: Joi.forbidden()
    })
  }),
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required()
  })
};

// ------------------------
// פונקציה ליצירת JWT
// ------------------------
export const generateToken = (user) => {
  const payload = { 
    userId: user._id,
    name: user.name,
    role: user.role,
    groupCode: user.teamCode // ⚡ זה השדה שה־backend משתמש בו
  };

  const secretKey = process.env.JWT_SECRET ?? "secret";
  return jwt.sign(payload, secretKey, { expiresIn: "1h" });
};

// ------------------------
// השוואת סיסמה
// ------------------------
userSchema.methods.comparePassword = async function(plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};

export default model("User", userSchema);
