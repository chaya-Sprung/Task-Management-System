import { Schema, model } from "mongoose";
import Joi from "joi";

// -------------------
// Schema של משימות קבוצתיות
// -------------------
const tasksSchema = new Schema({
  taskCode: { type: Number, required: true },
  date: { type: Date, required: true, default: Date.now },
  title: { type: String, required: true },
  content: { type: String, default: "" },
  status: { type: String, enum: ["open", "in-progress", "done"], default: "open" },
  groupCode: { type: String, minlength: 3, required: true }, // ✅ שונה ל-groupCode
  projectCode: { type: String },
  createdBy: { type: String, required: true },
  assignedTo: { type: String, default: null }
});

// -------------------
// Model
// -------------------
export const Task = model("Task", tasksSchema);

// -------------------
// Joi ולידציה
// -------------------
export const validateTask = Joi.object({
  taskCode: Joi.number().required(),
  date: Joi.date().optional(),
  title: Joi.string().required(),
  content: Joi.string().allow(""),
  status: Joi.string().valid("open", "in-progress", "done").default("open"),
  groupCode: Joi.string().min(3).required(),  // ✅ תואם ל-Schema ול-JWT
createdBy: Joi.alternatives(Joi.string(), Joi.object()).required(),
  projectCode: Joi.string().allow(null, ""),
  assignedTo: Joi.string().allow(null, "")
});
