const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema({
  create: { type: Boolean, default: false },
  edit: { type: Boolean, default: false },
  delete: { type: Boolean, default: false },
  view: { type: Boolean, default: false },
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
