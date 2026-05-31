import User from "../models/users.model.js";

// רישום ראש צוות (רק מנהל)
export const registerTeamLead = async (req, res) => {
  try {
    const teamLead = new User({ ...req.body, role: "TeamLead" });
    await teamLead.save();
    res.status(201).json({ message: "TeamLead registered", user: teamLead });
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
};

// רישום עובד (רק ראש צוות)
export const registerEmployee = async (req, res) => {
  try {
    const employee = new User({ ...req.body, role: "Employee" });
    await employee.save();
    res.status(201).json({ message: "Employee registered", user: employee });
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
};
