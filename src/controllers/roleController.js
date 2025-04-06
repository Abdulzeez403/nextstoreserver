const logger = require("../middlewares/logger");
const Role = require("../models/role");
const asyncHandler = require("express-async-handler");

// Create a new role
const createRole = asyncHandler(async (req, res) => {
  const { name, permissions } = req.body;

  const existingRole = await Role.findOne({ name });
  if (existingRole) {
    logger.warn("Role creation failed - Role already exists");
    return res.status(400).json({ message: "Role already exists" });
  }

  const role = new Role({ name, permissions });
  await role.save();
  logger.info("New role created successfully");
  res.status(201).json({ message: "Role created successfully", role });
});

// Get all roles
const getAllRoles = asyncHandler(async (req, res) => {
  const roles = await Role.find();
  res.status(200).json(roles);
});

// Get role by ID
const getRoleById = asyncHandler(async (req, res) => {
  const role = await Role.findById(req.params.id);
  if (!role) {
    logger.warn(`Role with ID ${req.params.id} not found`);
    return res.status(404).json({ message: "Role not found" });
  }
  res.status(200).json(role);
});

// Update role
const updateRole = asyncHandler(async (req, res) => {
  const { name, permissions } = req.body;

  const role = await Role.findById(req.params.id);
  if (!role) {
    logger.warn("Role update failed - Role not found");
    return res.status(404).json({ message: "Role not found" });
  }

  role.name = name || role.name;
  role.permissions = permissions || role.permissions;

  await role.save();
  logger.info(`Role ${role.name} updated successfully`);
  res.json({ message: "Role updated successfully", role });
});

// Delete role
const deleteRole = asyncHandler(async (req, res) => {
  const role = await Role.findById(req.params.id);
  if (!role) {
    logger.warn("Role deletion failed - Role not found");
    return res.status(404).json({ message: "Role not found" });
  }

  await role.remove();
  logger.info(`Role ${role.name} deleted successfully`);
  res.json({ message: "Role deleted successfully" });
});

module.exports = {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
};
