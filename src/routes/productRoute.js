const express = require("express");
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const upload = require("../middlewares/multer");

const {
  authenticateUser,
  authorizeAdmin,
  checkPermission,
} = require("../middlewares/authMiddleware");

router.post(
  "/",
  upload.array("images", 5),
  checkPermission("products.create"),
  createProduct
);
router.get(
  "/",
  authenticateUser,
  checkPermission("products.view"),
  getAllProducts
);
router.get(
  "/:id",
  authenticateUser,
  checkPermission("products.view"),
  getProductById
);
router.put(
  "/:id",
  upload.array("images", 5),
  authenticateUser,

  checkPermission("products.edit"),
  updateProduct
);
router.delete(
  "/:id",
  authenticateUser,

  checkPermission("products.delete"),
  deleteProduct
);

module.exports = router;
