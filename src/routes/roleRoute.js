const express = require("express");
const router = express.Router();
const {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
} = require("../controllers/roleController");

const {
  authenticateUser,
  authorizeAdmin,
  checkPermission,
} = require("../middlewares/authMiddleware");

// Create a new role
router.post("/", authenticateUser, checkPermission("roles.create"), createRole);

// Get all roles
router.get("/", authenticateUser, getAllRoles);

// Get a specific role by ID
router.get(
  "/:id",
  authenticateUser,
  checkPermission("roles.view"),
  getRoleById
);

// Update role
router.put("/:id", authenticateUser, updateRole);

// Delete role
router.delete(
  "/:id",
  authenticateUser,
  checkPermission("roles.delete"),
  deleteRole
);

module.exports = router;
