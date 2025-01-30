const logger = require("../middlewares/logger");
const User = require("../models/userModel");
const Role = require("../models/role");
const Employee = require("../models/employee");
const asyncHandler = require("express-async-handler");

// Register a new user (Admin or Employee)
const registerUser = asyncHandler(async (req, res) => {
  const { email, password, name, role, isAdmin, employeeId } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    logger.warn("User registration failed - User already exists");
    return res.status(400).json({ message: "User already exists" });
  }

  // If employeeId is provided, ensure the employee exists
  let employee;
  if (employeeId) {
    employee = await Employee.findById(employeeId);
    if (!employee) {
      logger.warn("Employee ID provided but not found");
      return res.status(404).json({ message: "Employee not found" });
    }
  }

  // Ensure the provided role exists
  let assignedRole;
  if (role) {
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
    employeeId: employee ? employee._id : null,
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
      .populate("role", "name")
      .populate("employeeId");

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
      .populate("role", "name")
      .populate("employeeId");
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

// Update user information
const updateUser = asyncHandler(async (req, res) => {
  const { name, email, role, employeeId } = req.body;

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

  // Update employee link if provided
  if (employeeId) {
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    user.employeeId = employee._id;
  }

  await user.save();
  logger.info(`User ${user.name} updated successfully`);
  res.json({ message: "User updated successfully", user });
});

module.exports = { registerUser, currentUser, updateUser, getAllUsers };
