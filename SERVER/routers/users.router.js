import { Router } from "express";
import { validateJoi } from "../middlewares/validate.middleware.js";
import { validateUser } from "../models/users.model.js";
import { registerTeamLead, registerEmployee } from "../controllers/users.controller.js";
import { checkRole } from "../middlewares/role.middleware.js";

const router = Router();

router.post(
  "/register/teamlead",
  validateJoi(validateUser.register),
  checkRole(["Manager"]),
  registerTeamLead
);

router.post(
  "/register/employee",
  validateJoi(validateUser.register),
  checkRole(["TeamLead"]),
  registerEmployee
);

export default router;
