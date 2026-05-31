import { Router } from "express";
import { 
  getAllTasks,  
  addTask, 
  updateTask, 
  deleteTask, 
  getTasksByDate,
  getTasksByProject,
  getAllTasksForEmployee
} from "../controllers/tasks.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = Router();

// כל המשימות של המשתמש (TeamLead: כל המשימות שלו, Employee: כל המשימות של הצוות שלו)
router.get("/", auth, getAllTasks);

// משימות לפי תאריך
router.get("/by-date", auth, getTasksByDate);

// משימות לפי פרויקט (ל־TeamLead)
router.get("/project", auth, getTasksByProject);

// משימות לפי קוד צוות (ל־Employee)
router.get("/team", auth, getAllTasksForEmployee);

// יצירת משימה
router.post("/", auth, addTask);

// עדכון משימה
router.put("/:id", auth, updateTask);

// מחיקת משימה
router.delete("/:id", auth, deleteTask);

export default router;
