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
  authMiddleware,
  authorizeAdmin,
} = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, authorizeAdmin, createStore);
router.get("/", authMiddleware, getStores);
router.get("/:id", authMiddleware, getStoreById);
router.put("/:id", authMiddleware, updateStore);
router.delete("/:id", authMiddleware, deleteStore);

module.exports = router;
