// backend/routes/storeRoutes.js
const express = require("express");
const {
  createStore,
  getStores,
  getStoreById,
  updateStore,
  deleteStore,
} = require("../controllers/storeController");

const router = express.Router();
const {
  authenticateUser,
  authorizeAdmin,
} = require("../middlewares/authMiddleware");

router.post("/", authenticateUser, authorizeAdmin, createStore);
router.get("/", authenticateUser, getStores);
router.get("/:id", authenticateUser, getStoreById);
router.put("/:id", authenticateUser, updateStore);
router.delete("/:id", authenticateUser, deleteStore);

module.exports = router;
