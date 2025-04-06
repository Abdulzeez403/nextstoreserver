const express = require("express");
const router = express.Router();

const {
  registerUser,
  currentUser,
  updateUser,
  getAllUsers,
  deleteUser,
  getUserById,
} = require("../controllers/userController");

const {
  authenticateUser,
  authorizeAdmin,
} = require("../middlewares/authMiddleware");

router.get("/", getAllUsers);
router.get("/me", authenticateUser, currentUser);
router.get("/:id", getUserById);
router.post("/register", registerUser);
router.put("/me", authenticateUser, updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
