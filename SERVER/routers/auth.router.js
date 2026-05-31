import { Router } from "express";
import { validateJoi } from "../middlewares/validate.middleware.js";
import { validateUser } from "../models/users.model.js";
import { login, register } from "../controllers/auth.controller.js";
import { auth, authRole } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";
import User from "../models/users.model.js"; // ✅ תוסיפי את זה כדי לשלוף את המשתמש מה-DB

const router = Router();

// --- LOGIN ---
router.post(
  "/login",
  (req, res, next) => {
    console.log("BODY BEFORE VALIDATION:", req.body);
    next();
  },
  validateJoi(validateUser.login),
  login
);

// --- REGISTER עם תמונה ---
router.post(
  "/register",
  upload.single("avatar"), // multer
  validateJoi(validateUser.register),
  register
);

// --- דוגמאות ל-routes מוגנים ---
router.get("/manager-only", auth, authRole(["Manager"]), (req, res) => {
  res.json({ msg: "Welcome Manager!" });
});

router.get("/teamlead-only", auth, authRole(["TeamLead"]), (req, res) => {
  res.json({ msg: "Welcome TeamLead!" });
});

router.get("/manager-teamlead", auth, authRole(["Manager", "TeamLead"]), (req, res) => {
  res.json({ msg: "Welcome Manager or TeamLead!" });
});

router.get("/all-users", auth, authRole(["Manager", "TeamLead", "Employee"]), (req, res) => {
  res.json({ msg: "Welcome all users!" });
});

// --- נתוני המשתמש הנוכחי ---
router.get("/me", auth, async (req, res) => {
  try {
    // משתמש לפי ה-ID מה־JWT
    const user = await User.findById(req.user.userId).select("name role profileImage");

    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json({
      name: user.name,
      role: user.role,
      profileImage: user.profileImage
        ? `http://localhost:5000/uploads/${user.profileImage}`
        : null,
    });
  } catch (err) {
    console.error("❌ /auth/me error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

console.log("✅ auth router loaded");

export default router;
