import express, { json, urlencoded } from "express";
import morgan from "morgan";
import cors from "cors";
import path from "path";

import { connectDB } from "./config/db.js";
import authRouter from "./routers/auth.router.js";
import usersRouter from "./routers/users.router.js";
import tasksRouter from "./routers/tasks.router.js";
import projectsRouter from "./routers/projects.router.js";

const app = express();

// Logger
app.use(morgan("dev"));

// CORS
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true
}));

// Body parsing
app.use(json());
app.use(urlencoded({ extended: true }));

// --- חשיפת תיקיית התמונות ---
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Routes
app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/tasks", tasksRouter);
app.use("/projects", projectsRouter);

// Start server
const port = process.env.PORT ?? 5000;
connectDB()
  .then(() => {
    app.listen(port, () => console.log(`✅ Server running on port ${port}`));
  })
  .catch(err => console.error("DB connection error:", err));
