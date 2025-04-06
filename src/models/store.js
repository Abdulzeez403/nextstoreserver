const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true, index: true },
    description: { type: String, trim: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Store creator
    assignedEmployees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Store employees
    status: { type: String, enum: ["active", "inactive"], default: "active" }, // Store status
    contact: {
      phone: { type: String, trim: true },
      email: { type: String, trim: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Store", storeSchema);
