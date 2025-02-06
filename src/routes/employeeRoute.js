const express = require("express");
const router = express.Router();
const {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employeeController");

const {
  authenticateUser,
  authorizeAdmin,
} = require("../middlewares/authMiddleware");

// Create a new employee
router.post("/", authenticateUser, authorizeAdmin, createEmployee);

// Get all employees
router.get("/", authenticateUser, authorizeAdmin, getAllEmployees);

// Get a specific employee by ID
router.get("/:id", authenticateUser, authorizeAdmin, getEmployeeById);

// Update employee
router.put("/:id", authenticateUser, authorizeAdmin, updateEmployee);

// Delete employee
router.delete("/:id", authenticateUser, authorizeAdmin, deleteEmployee);

module.exports = router;
