const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const logger = require("../middlewares/logger");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Middleware to verify token and authenticate user
const authenticateUser = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    logger.warn("Unauthorized access attempt - No token provided");
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.id)
      .select("-password")
      .populate("role", "name");

    if (!req.user) {
      logger.warn("Unauthorized access attempt - User not found");
      return res.status(401).json({ error: "User not found." });
    }

    logger.info(`User authenticated: ${req.user.email}`);
    next();
  } catch (err) {
    logger.error("Invalid token - Access denied");
    res.status(401).json({ error: "Invalid token." });
  }
};

// Middleware to check if user is an admin
const authorizeAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    logger.warn(
      `Unauthorized admin access attempt by ${req.user?.email || "Unknown"}`
    );
    return res.status(403).json({ error: "Access denied. Admins only." });
  }
  next();
};

module.exports = { authenticateUser, authorizeAdmin };
