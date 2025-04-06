const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema({
  create: { type: Boolean, default: true },
  edit: { type: Boolean, default: true },
  delete: { type: Boolean, default: true },
  view: { type: Boolean, default: true },
});

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    permissions: {
      products: permissionSchema,
      stores: permissionSchema,
      staff: permissionSchema,
      roles: permissionSchema,
      customers: permissionSchema,
      analytics: { view: { type: Boolean, default: false } },
      settings: { manage: { type: Boolean, default: false } },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Role", roleSchema);
