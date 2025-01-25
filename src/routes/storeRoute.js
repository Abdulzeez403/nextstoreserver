// backend/routes/storeRoutes.js
const express = require('express');
const {
  createStore,
  getStores,
  getStoreById,
  updateStore,
  deleteStore,
} = require('../controllers/storeController');

const router = express.Router();

router.post('/', createStore);
router.get('/', getStores);
router.get('/:id', getStoreById);
router.put('/:id', updateStore);
router.delete('/:id', deleteStore);

module.exports = router;
