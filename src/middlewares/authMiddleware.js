const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const logger = require("../middlewares/logger");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Middleware to verify token and authenticate user
const authenticateUser = async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token || !token.startsWith("Bearer ")) {
    logger.warn(
      "Unauthorized access attempt - No token provided or invalid format"
    );
    return res
      .status(401)
      .json({ error: "Access denied. Invalid token format." });
  }

  try {
    const authToken = token.split(" ")[1]; // Extract actual token
    const decoded = jwt.verify(authToken, JWT_SECRET);

    req.user = await User.findById(decoded.id)
      .select("-password")
      .populate("role"); // Ensure role is populated

    if (!req.user) {
      logger.warn("Unauthorized access attempt - User not found");
      return res.status(401).json({ error: "User not found." });
    }

    logger.info(
      `User authenticated: ${req.user.email}, Role: ${req.user.role?.name}`
    );
    next();
  } catch (err) {
    logger.error("Invalid token - Access denied");
    res.status(401).json({ error: "Invalid token." });
  }
};

// Middleware to check if user is an admin
const authorizeAdmin = (req, res, next) => {
  if (!req.user) {
    logger.warn("Unauthorized admin access attempt - No user found in request");
    return res.status(403).json({ error: "Access denied." });
  }

  if (req.user.role?.name !== "owner") {
    logger.warn(`Unauthorized admin access attempt by ${req.user.email}`);
    return res.status(403).json({ error: "Access denied. Admins only." });
  }

  next();
};

const checkPermission = (permission) => (req, res, next) => {
  const userRole = req.user?.role;

  console.log("User Role:", JSON.stringify(userRole, null, 2)); // Debugging
  console.log(
    "User Permissions:",
    JSON.stringify(userRole?.permissions, null, 2)
  );

  if (!userRole || !userRole.permissions) {
    return res
      .status(403)
      .json({ error: "Access Denied - No permissions assigned" });
  }

  // Split category and action
  const [category, action] = permission.split(".");

  console.log(`Checking permission: ${category}.${action}`);

  // Ensure the permission exists
  if (
    !userRole.permissions[category] ||
    !userRole.permissions[category][action]
  ) {
    return res.status(403).json({ error: "Access Denied" });
  }

  next();
};

module.exports = { authenticateUser, authorizeAdmin, checkPermission };
