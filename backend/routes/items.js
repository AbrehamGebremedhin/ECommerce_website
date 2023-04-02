const express = require('express');
const { getAllItems, getItem, addItem, updateItem, deleteItem, itemPhotoUpload } = require('../controllers/items');
const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth')
const Item = require('../models/Item');

const router = express.Router();

router.route('/:id/photo').put(protect, authorize('admin'), itemPhotoUpload);

router.route('/allItems').get(advancedResults(Item), getAllItems);
router.route('/:id').get(getItem).put(protect, authorize('admin'), updateItem).delete(protect, authorize('admin'), deleteItem);
router.route('/addItem').post(protect, authorize('admin'), addItem);


module.exports = router;