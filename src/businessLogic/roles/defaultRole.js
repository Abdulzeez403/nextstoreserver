const Role = require("../../models/role"); // Assuming you have a role model

const DefaultRoles = async () => {
  try {
    const roles = ["owner", "admin", "employee"];

    for (const roleName of roles) {
      const existingRole = await Role.findOne({ name: roleName });
      if (!existingRole) {
        await Role.create({ name: roleName });
        console.log(`Role "${roleName}" created.`);
      }
    }
  } catch (err) {
    console.error("Error creating roles", err);
  }
};

module.exports = { DefaultRoles };
