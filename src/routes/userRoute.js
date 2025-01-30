const express = require("express");
const router = express.Router();

const {
  registerUser,
  currentUser,
  updateUser,
  getAllUsers,
} = require("../controllers/userController");

const {
  authMiddleware,
  authorizeAdmin,
} = require("../middlewares/authMiddleware");

router.get("/", authMiddleware, authorizeAdmin, getAllUsers);
router.get("/me", authMiddleware, currentUser);
router.post("/register", registerUser);
router.put("/me", authMiddleware, updateUser);

module.exports = router;
