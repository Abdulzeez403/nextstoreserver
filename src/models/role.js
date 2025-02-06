const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      enum: ["owner", "admin", "employee"], // Define the available roles
    },
    permissions: {
      type: [String], // Array to store the permissions assigned to the role
      default: [],
    },
  },
  {
    timestamps: true, // Add timestamps (createdAt, updatedAt)
  }
);

module.exports = mongoose.model("Role", roleSchema);
