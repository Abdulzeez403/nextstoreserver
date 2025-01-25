const asyncHandler = require("express-async-handler");
const Product = require("../models/Product");
const cloudinary = require("../connections/cloudinary");

// Create a new product
const createProduct = asyncHandler(async (req, res) => {
  try {
    const { specifications, images, ...productData } = req.body;
    const files = req.files;
    const parsedSpecifications = specifications.map((spec) => JSON.parse(spec));

    if (!files || files.length === 0) {
      return res
        .status(400)
        .json({ success: false, error: "Please upload at least one image" });
    }

    const uploadPromises = files.map(async (file) => {
      const uploadedImage = await cloudinary.uploader.upload(file.path, {
        folder: "products",
      });

      // Clean up the local file after uploading to Cloudinary
      await unlink(file.path);

      return uploadedImage;
    });

    const uploadedImages = await Promise.all(uploadPromises);
    const imageUrls = uploadedImages.map((image) => image.secure_url);

    const product = new Product({
      ...productData,
      images: imageUrls,
      specifications: parsedSpecifications,
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
  const { specifications, images, ...productData } = req.body;
  const files = req.files;
  const parsedSpecifications = specifications.map((spec) => JSON.parse(spec));

  if (!files || files.length === 0) {
    return res
      .status(400)
      .json({ success: false, error: "Please upload at least one image" });
  }

  const uploadPromises = files.map((file) =>
    cloudinary.uploader.upload(file.path, { folder: "products" })
  );

  const uploadedImages = await Promise.all(uploadPromises);
  const imageUrls = uploadedImages.map((image) => image.secure_url);

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { ...productData, images: imageUrls, specifications: parsedSpecifications },
    {
      new: true,
    }
  );
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
