// backend/controllers/storeController.js
const asyncHandler = require("express-async-handler");
const Store = require("../models/store");

// Create a store
const createStore = asyncHandler(async (req, res) => {
  const store = await Store.create(req.body);
  res.status(201).json(store);
});

// Get all stores
const getStores = asyncHandler(async (req, res) => {
  const stores = await Store.find();
  res.status(200).json(stores);
});

// Get a single store by ID
const getStoreById = asyncHandler(async (req, res) => {
  const store = await Store.findById(req.params.id);
  if (!store) {
    res.status(404);
    throw new Error("Store not found");
  }
  res.status(200).json(store);
});

// Update a store
const updateStore = asyncHandler(async (req, res) => {
  const store = await Store.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!store) {
    res.status(404);
    throw new Error("Store not found");
  }
  res.status(200).json(store);
});

// Delete a store
const deleteStore = asyncHandler(async (req, res) => {
  const store = await Store.findByIdAndDelete(req.params.id);
  if (!store) {
    res.status(404);
    throw new Error("Store not found");
  }
  res.status(200).json({ message: "Store deleted successfully" });
});

module.exports = {
  createStore,
  getStores,
  getStoreById,
  updateStore,
  deleteStore,
};
