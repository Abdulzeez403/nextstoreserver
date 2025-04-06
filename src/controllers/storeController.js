const logger = require("../middlewares/logger");
const Store = require("../models/store");
const asyncHandler = require("express-async-handler");

// Create a new store
const createStore = asyncHandler(async (req, res) => {
  const { name } = req.body;

  // Check if store already exists
  const existingStore = await Store.findOne({ name });
  if (existingStore) {
    logger.warn("Store creation failed - Store already exists");
    return res.status(400).json({ message: "Store already exists" });
  }

  const store = new Store({ ...req.body, userId: req.user._id });
  await store.save();
  logger.info("New store created successfully");
  res.status(201).json({ message: "Store created successfully", store });
});

// Get all stores
const getStores = asyncHandler(async (req, res) => {
  try {
    const stores = await Store.find();
    res.status(200).json(stores);
  } catch (error) {
    logger.error(`Error retrieving stores: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
});

// Get store by ID
const getStoreById = asyncHandler(async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) {
      logger.warn(`Store with ID ${req.params.id} not found`);
      return res.status(404).json({ message: "Store not found" });
    }
    res.status(200).json(store);
  } catch (error) {
    logger.error(`Error retrieving store: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
});

// Update store
const updateStore = asyncHandler(async (req, res) => {
  const { name, location } = req.body;

  const store = await Store.findByIdAndUpdate(
    req.params.id,
    { name, location },
    { new: true, runValidators: true }
  );

  if (!store) {
    logger.warn("Store update failed - Store not found");
    return res.status(404).json({ message: "Store not found" });
  }

  logger.info(`Store '${store.name}' updated successfully`);
  res.json({ message: "Store updated successfully", store });
});

// Delete store
const deleteStore = asyncHandler(async (req, res) => {
  const store = await Store.findById(req.params.id);
  if (!store) {
    logger.warn("Store deletion failed - Store not found");
    return res.status(404).json({ message: "Store not found" });
  }

  await Store.deleteOne({ _id: req.params.id });
  logger.info(`Store '${store.name}' deleted successfully`);
  res.json({ message: "Store deleted successfully" });
});

module.exports = {
  createStore,
  getStores,
  getStoreById,
  updateStore,
  deleteStore,
};
