const express = require("express");
const router = express.Router();

const {
  registerUser,
  currentUser,
  updateUser,
  getAllUsers,
} = require("../controllers/userController");

const {
  authenticateUser,
  authorizeAdmin,
} = require("../middlewares/authMiddleware");

router.get("/", authenticateUser, getAllUsers);
router.get("/me", authenticateUser, currentUser);
router.post("/register", registerUser);
router.put("/me", authenticateUser, updateUser);

module.exports = router;
