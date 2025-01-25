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

// Product routes
router.post("/", upload.array("images", 5), createProduct);
router.get("/", getAllProducts); // Public route
router.get("/:id", getProductById); // Public route
router.put("/:id", upload.array("images", 5), updateProduct);
router.delete("/:id", deleteProduct); // Admin only

module.exports = router;
