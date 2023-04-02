const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Cart = require('../models/Cart');
const Item = require('../models/Item');

//Get a user's cart
exports.getCart = asyncHandler( async(req,res,next) => {
    const cart = await Cart.findById(req.user.id);

    res.status(200).json({
        success: true,
        data: cart
    })
});

//add an item to a cart
exports.addItemToCart = asyncHandler( async(req,res,next) => {
    const item = await Item.findById(req.params.id);
    const exsitingCart = await Cart.find({ user: req.user.id});

    const newCart = {
        Items: {
            item: item,
            quantity: req.body.quantity
        },
        price: item.price * req.body.quantity,
        status: "Added to cart",
        user: req.user.id
    }
    const cart = await Cart.create(newCart);

    res.status(200).json({
        success: true,
        data: cart
    })
});

//add an item to a cart
exports.addAnother = asyncHandler( async(req,res,next) => {
    const item = await Item.findById(req.params.itemId);
    const exsitingCart = await Cart.findById(req.params.cartId)

    const newItems = {
        item: item,
        quantity: req.body.quantity
    }

    exsitingCart.Items.push(newItems)
    exsitingCart.price = exsitingCart.price + (item.price * req.body.quantity);

    await exsitingCart.save();

    res.status(200).json({
        success: true,
        data: exsitingCart.Items
    })
});