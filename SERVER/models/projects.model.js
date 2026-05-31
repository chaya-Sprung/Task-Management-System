// models/projects.model.js
import mongoose, { Schema, model } from "mongoose";
import Joi from "joi";

// ----------------------
// Project Schema
// ----------------------
const projectSchema = new Schema({
  projectName: { type: String, required: true },
  projectCode: { type: String, required: true, unique: true },
  teamCode: { type: String, default: null },          // אופציונלי
  teamLeadName: { type: String, default: null },      // אופציונלי
}, { timestamps: true });

// יצוא מודל MongoDB בשם Project
const Project = model("projects", projectSchema);
export default Project;

// ----------------------
// Joi Validation
// ----------------------
export const validateProject = {
  create: Joi.object({
    projectName: Joi.string().min(3).max(50).required(),
    projectCode: Joi.string().alphanum().min(3).max(20).required(),
    teamCode: Joi.string().alphanum().min(3).max(20).optional().allow(null, ''),
    teamLeadName: Joi.string().min(3).max(50).optional().allow(null, ''),
  }),

  update: Joi.object({
    projectName: Joi.string().min(1).max(50).optional(),
    teamCode: Joi.string().alphanum().min(3).max(20).optional().allow(null, ''),
    teamLeadName: Joi.string().min(3).max(50).optional().allow(null, ''),
  })
};
