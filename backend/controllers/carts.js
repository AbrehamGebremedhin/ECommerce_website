const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Cart = require('../models/Cart');
const Item = require('../models/Item');
const mongoose = require('mongoose');

//Get a user's cart
exports.getCart = asyncHandler( async(req,res,next) => {
    const cart = await Cart.findById(req.user.id);

    if(!cart){
        return next(new ErrorResponse(`The user doesn't have any carts yet`, 404));
    }

    res.status(200).json({
        success: true,
        data: cart
    })
});

//create a cart
exports.addItemToCart = asyncHandler( async(req,res,next) => {
    const item = await Item.findById(req.params.id);
    
    if(!item){
        return next(new ErrorResponse(`Item not found using ${req.params.id}`, 404));
    }

    const newCart = {
        Items: {
            name: item.name,
            price: item.price,
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
    
    if(!item){
        return next(new ErrorResponse(`Item not found using ${req.params.itemId}`, 404));
    }
    if(!exsitingCart){
        return next(new ErrorResponse(`Cart not found using ${req.params.cartId}`, 404));
    }

    const newItems = {
        name: item.name,
        price: item.price,
        quantity: req.body.quantity
    }

    exsitingCart.Items.push(newItems)
    exsitingCart.price = exsitingCart.price + (item.price * req.body.quantity);

    await exsitingCart.save();

    res.status(200).json({
        success: true,
        data: exsitingCart
    })
});

//update quantity
exports.updateQuantity = asyncHandler( async(req,res,next) => {
    const item = await Item.findById(req.params.itemId);
    const exsitingCart = await Cart.findById(req.params.cartId);

    if(!item){
        return next(new ErrorResponse(`Item not found using ${req.params.itemId}`, 404));
    }
    if(!exsitingCart){
        return next(new ErrorResponse(`Cart not found using ${req.params.cartId}`, 404));
    }

    let price = 0; 
    exsitingCart.Items.map(async (product) => {
        if(product.name === item.name){
            product.quantity = req.body.quantity;
            if(product.quantity < 0){
                exsitingCart.Items.splice(exsitingCart.Items.indexOf(product), 1);
                price = price - (product.price * product.quantity);
            }
        }
        price = price + (product.price * product.quantity);
    });

    exsitingCart.price = price;

    await exsitingCart.save();

    res.status(200).json({
        success: true,
        data: exsitingCart
    })
});

//remove item from cart
exports.removeItem = asyncHandler( async(req,res,next) => {
    const item = await Item.findById(req.params.itemId);
    const exsitingCart = await Cart.findById(req.params.cartId);

    if(!item){
        return next(new ErrorResponse(`Item not found using ${req.params.itemId}`, 404));
    }
    if(!exsitingCart){
        return next(new ErrorResponse(`Cart not found using ${req.params.cartId}`, 404));
    }

    let price = 0; 
    //Checks if the item is in the cart and if found it will remove said item from the cart and updates the price
    exsitingCart.Items.map(async (product) => {
        if(product.name === item.name){
            exsitingCart.Items.splice(exsitingCart.Items.indexOf(product), 1);
            price = price - (product.price * product.quantity);
        }
        price = price + (product.price * product.quantity);
    });

    if(exsitingCart.Items.length === 0){
        await Cart.findByIdAndDelete(req.params.cartId)
    }

    //Set the updated price
    exsitingCart.price = price;
    await exsitingCart.save()

    res.status(200).json({
        success: true,
        data: exsitingCart
    })
});