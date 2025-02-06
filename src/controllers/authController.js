const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const Role = require("../models/role");
const logger = require("../middlewares/logger");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Login a user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email }).populate("role", "name");
    // .populate("employeeId");

    if (!user) {
      logger.warn(`Login failed - No user found with email: ${email}`);
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.warn(`Login failed - Incorrect password for email: ${email}`);
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role?.name,
        isAdmin: user.isAdmin,
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    logger.info(`User logged in: ${user.email}`);

    // Respond with user details & token
    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role?.name || "No Role Assigned",
        isAdmin: user.isAdmin,
        token,
      },
    });
  } catch (err) {
    logger.error(`Login error: ${err.message}`);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { loginUser };
