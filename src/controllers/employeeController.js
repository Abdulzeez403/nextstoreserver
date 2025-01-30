const logger = require("../middlewares/logger");
const Employee = require("../models/employee");
const asyncHandler = require("express-async-handler");

// Create a new employee
const createEmployee = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Check if employee already exists
  const existingEmployee = await Employee.findOne({ email });
  if (existingEmployee) {
    logger.warn("Employee creation failed - Employee already exists");
    return res.status(400).json({ message: "Employee already exists" });
  }

  const employee = new Employee({ ...req.body });
  await employee.save();
  logger.info("New employee created successfully");
  res.status(201).json({ message: "Employee created successfully", employee });
});

// Get all employees
const getAllEmployees = asyncHandler(async (req, res) => {
  try {
    const employees = await Employee.find().populate("role", "name"); // Populate role data
    res.status(200).json(employees);
  } catch (error) {
    logger.error(`Error retrieving employees: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
});

// Get employee by ID
const getEmployeeById = asyncHandler(async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).populate(
      "role",
      "name"
    );
    if (!employee) {
      logger.warn(`Employee with ID ${req.params.id} not found`);
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json(employee);
  } catch (error) {
    logger.error(`Error retrieving employee: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
});

// Update employee
const updateEmployee = asyncHandler(async (req, res) => {
  const { name, email, role, assignedStore } = req.body;

  const employee = await Employee.findById(req.params.id);
  if (!employee) {
    logger.warn("Employee update failed - Employee not found");
    return res.status(404).json({ message: "Employee not found" });
  }

  employee.name = name || employee.name;
  employee.email = email || employee.email;
  employee.role = role || role.role;
  employee.assignedStore = assignedStore || employee.assignedStore;

  await employee.save();
  logger.info(`Employee ${employee.name} updated successfully`);
  res.json({ message: "Employee updated successfully", employee });
});

// Delete employee
const deleteEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id);
  if (!employee) {
    logger.warn("Employee deletion failed - Employee not found");
    return res.status(404).json({ message: "Employee not found" });
  }

  await employee.remove();
  logger.info(`Employee ${employee.name} deleted successfully`);
  res.json({ message: "Employee deleted successfully" });
});

module.exports = {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};
