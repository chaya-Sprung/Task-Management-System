import { isValidObjectId } from "mongoose";
import { Task, validateTask } from "../models/tasks.model.js"; 

// ----------------------------
// כל המשימות לפי סוג המשתמש
// ----------------------------
// ----------------------------
// כל המשימות של העובד לפי ראש הצוות שלו
// ----------------------------


// ----------------------------
// משימה לפי ID
// ----------------------------
export const getTaskById = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) 
      return res.status(404).json({ error: "Task not found" });

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    res.json(task);
  } catch (error) {
    next({ msg: error.message });
  }
};

// ----------------------------
// משימות לפי תאריך (של הצוות של המשתמש)
// ----------------------------
export const getTasksByDate = async (req, res, next) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ error: "Date is required" });

    const userTeamCode = req.user.teamCode;
    const start = new Date(date);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

 // Employee רואה את כל המשימות של הצוות שלו (של ראש הצוות)
const tasks = await Task.find({ groupCode: user.groupCode })
                        .populate("assignedTo", "name email")
                        .populate("createdBy", "name email");


    res.json(tasks);
  } catch (error) {
    next({ msg: error.message });
  }
};

// ----------------------------
// כל המשימות לפי סוג המשתמש או פרויקט ספציפי
// ----------------------------
export const getAllTasks = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "❌ יש להתחבר כדי לראות משימות" });
    }

    const filter = {};

    // אם נשלח projectCode ב-query – מחזיר רק את המשימות של הפרויקט הזה
    if (req.query.projectCode) {
      filter.projectCode = req.query.projectCode;
    } 
    // אחרת, אם משתמש הוא TeamLead או Employee – מחזיר את כל המשימות של הקבוצה שלו
    else if (user.role === "TeamLead" || user.role === "Employee") {
      if (!user.groupCode) {
        return res.status(400).json({ message: "❌ קוד צוות לא נמצא למשתמש" });
      }
      filter.groupCode = user.groupCode;
    }

    const tasks = await Task.find(filter)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    if (!tasks || tasks.length === 0) {
      return res.json([]);
    }

    res.json(tasks);
  } catch (error) {
    console.error("🔥 Error fetching tasks:", error);
    res.status(500).json({ message: "שגיאה בטעינת המשימות" });
  }
};

// ----------------------------
export const addTask = async (req, res) => {
  try {
    const user = req.user; // ✅ המשתמש נשלף מה־JWT

    if (!user) {
      return res.status(401).json({ msg: "❌ יש להתחבר כדי להוסיף משימות" });
    }

    // ⚠️ כאן מתקבל ה־creatorId מה־JWT
    const creatorId = user.userId;  // השתמש בשם השדה כפי שהוא ב־JWT

    if (!creatorId) {
      return res.status(400).json({ msg: "❌ מזהה המשתמש חסר" });
    }

    const groupCode = user.groupCode || req.body.groupCode;
    if (!groupCode) {
      return res.status(400).json({ msg: "❌ קוד צוות חסר למשתמש" });
    }

    const taskData = {
      taskCode: req.body.taskCode || Date.now(),
      date: req.body.date ? new Date(req.body.date) : new Date(),
      title: req.body.title,
      content: req.body.content || "",
      status: req.body.status || "open",
      groupCode,
      createdBy: creatorId,  // ✅ כאן משתמשים ב־creatorId
      assignedTo: req.body.assignedTo || null,
      projectCode: req.body.projectCode || null,
    };

    const { error } = validateTask.validate(taskData);
    if (error) {
      return res.status(400).json({ msg: error.details[0].message });
    }

    const newTask = new Task(taskData);
    await newTask.save();

    console.log("🟢 משימה נוספה בהצלחה:", newTask);
    res.status(201).json(newTask);
  } catch (err) {
    console.error("❌ AddTask Error:", err);
    res.status(500).json({ message: "שגיאה בשרת: " + err.message });
  }
};

// ----------------------------
// עדכון משימה
// ----------------------------
export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ error: "Task not found" });

    res.json(task);
  } catch (error) {
    next({ msg: error.message });
  }
};

// ----------------------------
// מחיקת משימה
// ----------------------------
export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    res.status(204).end();
  } catch (error) {
    next({ msg: error.message });
  }
};





// TeamLead - רק משימות של פרויקט ספציפי
export const getTasksByProject = async (req, res) => {
  const { projectCode } = req.query;
  const user = req.user;

  if (!projectCode) return res.status(400).json({ msg: "Missing projectCode" });

  // מחזיר את כל המשימות של הפרויקט בלי לסנן לפי מי יצר
  const tasks = await Task.find({ projectCode })
                          .populate("assignedTo", "name email")
                          .populate("createdBy", "name email");

  res.json(tasks);
};


// Employee - כל המשימות של הצוות שלו
export const getAllTasksForEmployee = async (req, res) => {
  const user = req.user;

  if (!user.groupCode) return res.status(400).json({ msg: "Missing groupCode" });

  const tasks = await Task.find({ groupCode: user.groupCode })
                          .populate("assignedTo", "name email")
                          .populate("createdBy", "name email");

  res.json(tasks);
};
