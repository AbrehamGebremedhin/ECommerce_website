const express = require('express');
const { getCart, checkCart, addItemToCart, addAnother, updateQuantity, removeItem, confirmPayment } = require('../controllers/carts');
const { protect } = require('../middleware/auth')


const router = express.Router();

router.route('/getCart').get(protect, getCart);
router.route('/checkCart').get(protect, checkCart);
router.route('/addCart/:id').post(protect, addItemToCart);
router.route('/updateCart/:itemId/:cartId').put(protect, addAnother);
router.route('/updateQuantity/:itemId/:cartId').put(protect, updateQuantity);
router.route('/removeItem/:itemId/:cartId').put(protect, removeItem);
router.route('/confirmPayment/:cartId').put(protect, confirmPayment);

module.exports = router;