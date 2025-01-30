const express = require("express");
const router = express.Router();
const {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employeeController");

// Create a new employee
router.post("/", createEmployee);

// Get all employees
router.get("/", getAllEmployees);

// Get a specific employee by ID
router.get("/:id", getEmployeeById);

// Update employee
router.put("/:id", updateEmployee);

// Delete employee
router.delete("/:id", deleteEmployee);

module.exports = router;
