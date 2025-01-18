const logger = require("../middlewares/logger");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

// Register a new user
const registerUser = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    // logger.warn("User registration failed - User already exists");
    return res.status(400).json({ message: "User already exists" });
  }

  const user = new User({ ...req.body });
  await user.save();
  //   logger.info("New user registered successfully");
  res.status(201).json({ message: "User registered successfully" });
});

// Get current user
const currentUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      logger.warn(`User with ID ${req.user.id} not found`);
      return res.status(404).json({ message: "User not found" });
    }

    logger.info(`User data retrieved: ${user.username}`);
    return res.status(200).json(user);
  } catch (error) {
    logger.error(`Error retrieving user: ${error.message}`);
    return res.status(500).json({ message: "Server error" });
  }
});

// Get current user
const getAllUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.find();
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

// Update user information
const updateUser = asyncHandler(async (req, res) => {
  const { username, email } = req.body;

  const user = await User.findById(req.user.id);
  if (!user) {
    logger.warn("User update failed - User not found");
    return res.status(404).json({ message: "User not found" });
  }

  user.username = username || user.username;
  user.email = email || user.email;

  await user.save();
  logger.info(`User ${user.username} updated successfully`);
  res.json({ message: "User updated successfully", user });
});

module.exports = { registerUser, currentUser, updateUser, getAllUser };
