const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

// Import Models
const User = require("./models/userModel");
const Role = require("./models/roleModel");
const Employee = require("./models/employeeModel");

// Sample Data
const roles = [
  {
    name: "admin",
    permissions: ["manage_users", "manage_roles", "view_reports"],
  },
  { name: "manager", permissions: ["view_reports", "manage_employees"] },
  { name: "employee", permissions: ["view_tasks"] },
];

const users = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: "Admin@123",
    role: "admin",
  },
  {
    name: "John Doe",
    email: "johndoe@example.com",
    password: "User@123",
    role: "employee",
  },
  {
    name: "Jane Smith",
    email: "janesmith@example.com",
    password: "User@123",
    role: "manager",
  },
];

const employees = [
  {
    name: "Alice Johnson",
    email: "alice@example.com",
    password: "Employee@123",
    role: "employee",
    assignedStore: "Store A",
  },
  {
    name: "Bob Williams",
    email: "bob@example.com",
    password: "Employee@123",
    role: "manager",
    assignedStore: "Store B",
  },
];

// Seed Function
const seedDatabase = async () => {
  try {
    console.log("🌱 Seeding data...");

    await Role.deleteMany();
    await User.deleteMany();
    await Employee.deleteMany();

    console.log("✅ Old data cleared...");

    // Insert Roles
    await Role.insertMany(roles);
    console.log("✅ Roles added...");

    // Insert Users with Hashed Passwords
    const hashedUsers = await Promise.all(
      users.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10),
      }))
    );
    await User.insertMany(hashedUsers);
    console.log("✅ Users added...");

    // Insert Employees with Hashed Passwords
    const hashedEmployees = await Promise.all(
      employees.map(async (employee) => ({
        ...employee,
        password: await bcrypt.hash(employee.password, 10),
      }))
    );
    await Employee.insertMany(hashedEmployees);
    console.log("✅ Employees added...");

    console.log("🎉 Seeding completed successfully!");
  } catch (error) {
    console.error("❌ Seeding error:", error);
  }
};

module.exports = seedDatabase;
