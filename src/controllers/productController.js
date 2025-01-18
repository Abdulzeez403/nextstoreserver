// controllers/productController.js
const asyncHandler = require("express-async-handler");
const Product = require("../models/Product");
const { mapFiles } = require("../services/file");
// Create a new product
const createProduct = asyncHandler(async (req, res) => {
  try {
    const { images, ...productData } = req.body;
    const uploadedImages = await mapFiles(images);
    // Create a new product with the mapped image URLs
    const product = new Product({
      ...productData,
      images: uploadedImages,
    });

    await product.save();

    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Error creating product" });
  }
});

// Get products with pagination and filtering
const getAllProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const category = req.query.category || "";

  const query = category
    ? { category: { $regex: category, $options: "i" } }
    : {};

  const products = await Product.find(query)
    .skip((page - 1) * limit)
    .limit(limit);

  const totalProducts = await Product.countDocuments(query);

  res.status(200).json({
    products,
    totalPages: Math.ceil(totalProducts / limit),
    currentPage: page,
  });
});

// Get a single product by ID
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.status(200).json(product);
});

// Update a product by ID
const updateProduct = asyncHandler(async (req, res) => {
  const updatedData = req.body;
  const product = await Product.findByIdAndUpdate(req.params.id, updatedData, {
    new: true, // Return the updated document
  });
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.status(200).json({ message: "Product updated successfully", product });
});

// Delete a product by ID
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  await Product.findByIdAndDelete(req.params.id);

  res.status(200).json({ message: "Product deleted successfully" });
});

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
