const logger = require("../middlewares/logger");
const User = require("../models/userModel");
const Role = require("../models/role");
const asyncHandler = require("express-async-handler");

// Register a new user (Admin or Employee)
const registerUser = asyncHandler(async (req, res) => {
  const { email, password, name, role, isAdmin } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    logger.warn("User registration failed - User already exists");
    return res.status(400).json({ message: "User already exists" });
  }

  let assignedRole = null;
  // Check if this is the first user
  const userCount = await User.countDocuments();
  if (userCount === 0) {
    // Assign the "Owner" role to the first user
    assignedRole = await Role.findOne({ name: "owner" });

    if (!assignedRole) {
      logger.warn("Owner role not found in database");
      return res
        .status(500)
        .json({ message: "Owner role not found. Please create it first." });
    }
  } else if (role) {
    // Assign the provided role if specified
    assignedRole = await Role.findById(role);
    if (!assignedRole) {
      logger.warn("Role ID provided but not found");
      return res.status(404).json({ message: "Role not found" });
    }
  }

  // Create new user
  const user = new User({
    email,
    password,
    name,
    isAdmin: isAdmin || false,
    role: assignedRole ? assignedRole._id : null,
  });

  await user.save();
  logger.info("New user registered successfully");
  res.status(201).json({ message: "User registered successfully", user });
});

// Get current user
const currentUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate("role", "name");

    if (!user) {
      logger.warn(`User with ID ${req.user.id} not found`);
      return res.status(404).json({ message: "User not found" });
    }

    logger.info(`User data retrieved: ${user.name}`);
    return res.status(200).json(user);
  } catch (error) {
    logger.error(`Error retrieving user: ${error.message}`);
    return res.status(500).json({ message: "Server error" });
  }
});

// Get all users
const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .populate("role", "name");
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

// Update user information
const updateUser = asyncHandler(async (req, res) => {
  const { name, email, role } = req.body;

  const user = await User.findById(req.user.id);
  if (!user) {
    logger.warn("User update failed - User not found");
    return res.status(404).json({ message: "User not found" });
  }

  user.name = name || user.name;
  user.email = email || user.email;

  // Update role if provided
  if (role) {
    const assignedRole = await Role.findById(role);
    if (!assignedRole) {
      return res.status(404).json({ message: "Role not found" });
    }
    user.role = assignedRole._id;
  }

  await user.save();
  logger.info(`User ${user.name} updated successfully`);
  res.json({ message: "User updated successfully", user });
});

module.exports = { registerUser, currentUser, updateUser, getAllUsers };
