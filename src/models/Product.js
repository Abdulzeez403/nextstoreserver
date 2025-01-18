// models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    tag: { type: String, required: true },
    stock: { type: Number, default: 0 },
    swapping: { type: Boolean, default: false },
    images: [
      {
        url: { type: String }, // URL of the image
        type: { type: String }, // Type of the image (e.g., 'image/png')
        name: { type: String }, // Name of the image
      },
    ], // Array of image objects
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        name: { type: String, required: true },
        rating: { type: Number, required: true },
        comment: { type: String },
      },
    ],
    specifications: [
      {
        key: { type: String, required: true }, //
        value: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

module.exports = mongoose.model("Product", productSchema);
