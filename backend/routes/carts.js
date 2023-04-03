const express = require('express');
const { getCart, addItemToCart, addAnother, updateQuantity, removeItem } = require('../controllers/carts');
const advancedResults = require('../middleware/advancedResults');
const { protect } = require('../middleware/auth')


const router = express.Router();

router.route('/getCart').get(protect, getCart);
router.route('/addCart/:id').post(protect, addItemToCart);
router.route('/updateCart/:itemId/:cartId').put(protect, addAnother);
router.route('/updateQuantity/:itemId/:cartId').put(protect, updateQuantity);
router.route('/removeItem/:itemId/:cartId').put(protect, removeItem);

module.exports = router;