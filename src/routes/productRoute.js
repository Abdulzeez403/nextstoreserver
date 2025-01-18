// routes/productRoutes.js
const express = require("express");
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

// Product routes
router.post("/", createProduct);
router.get("/", getAllProducts); // Public route
router.get("/:id", getProductById); // Public route
router.put("/:id", updateProduct); // Admin only
router.delete("/:id", deleteProduct); // Admin only

module.exports = router;
