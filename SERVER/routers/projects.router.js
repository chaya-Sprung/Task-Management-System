// routes/projects.routes.js
import { Router } from "express";
import { validateJoi } from "../middlewares/validate.middleware.js";
import { validateProject } from "../models/projects.model.js";
import { getProjectsById, getAllProjects, addProject, updateProject, deleteProject } from "../controllers/projects.controller.js";

const router = Router();

// קבלת כל הפרויקטים
router.get('/', getAllProjects);

// קבלת פרויקט לפי ID
router.get('/:id', getProjectsById);

// קבלת פרויקטים לפי פרמטר (לדוגמה: companyName או teamCode)
//router.get('/filter/:param', getProjectsByParam);

// הוספת פרויקט חדש
router.post('/', validateJoi(validateProject.create), addProject);

// עדכון פרויקט קיים
router.put('/:id', validateJoi(validateProject.update), updateProject);

// מחיקת פרויקט
router.delete('/:id', deleteProject);

export default router;
