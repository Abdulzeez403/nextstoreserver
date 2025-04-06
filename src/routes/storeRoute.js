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

  checkPermission,
} = require("../middlewares/authMiddleware");

router.post(
  "/",
  authenticateUser,
  checkPermission("stores.create"),
  createStore
);
router.get("/", authenticateUser, checkPermission("stores.view"), getStores);
router.get(
  "/:id",
  authenticateUser,
  checkPermission("stores.view"),
  getStoreById
);
router.put(
  "/:id",
  authenticateUser,
  checkPermission("stores.edit"),
  updateStore
);
router.delete(
  "/:id",
  authenticateUser,
  checkPermission("stores.delete"),
  deleteStore
);

module.exports = router;
