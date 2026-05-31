import User, { generateToken } from "../models/users.model.js";

// ---------------------
// Register
// ---------------------
export const register = async (req, res) => {
  try {
    const { password, confirmPassword, role, ...rest } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const profileImage = req.file ? req.file.filename : "";

    const user = new User({
      ...rest,
      role,
      password,
      profileImage
    });

    await user.save();

    const token = generateToken(user);

    return res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage
      }
    });

  } catch (error) {
    console.error("Register error:", error.message);
    return res.status(400).json({ message: error.message });
  }
};

// ---------------------
// Login
// ---------------------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email incorrect" });

    const isValid = await user.comparePassword(password);
    if (!isValid) return res.status(400).json({ message: "Password incorrect" });

    const token = generateToken(user);

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
