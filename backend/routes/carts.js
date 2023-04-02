const express = require('express');
const { getCart, addItemToCart, addAnother } = require('../controllers/carts');
const advancedResults = require('../middleware/advancedResults');
const { protect } = require('../middleware/auth')


const router = express.Router();

router.route('/getCart').get(protect, getCart);
router.route('/addCart/:id').post(protect, addItemToCart);
router.route('/updateCart/:itemId/:cartId').put(protect, addAnother);

module.exports = router;