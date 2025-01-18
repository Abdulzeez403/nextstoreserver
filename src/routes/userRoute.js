const express = require("express");
const {
  registerUser,
  currentUser,
  updateUser,
  getAllUser,
} = require("../controllers/userController");

const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();
router.get("/", getAllUser);
router.post("/register", registerUser);
router.get("/me", authMiddleware, currentUser);
router.put("/me", authMiddleware, updateUser);

module.exports = router;
