const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    Items: [
        {
            name: {
                type: String,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }            
        }
    ],
    price: {
        type: Number
    },
    status: {
        type: String,
        enum: ['Added to cart', 'Confirmed'],
        default: 'Added to cart'
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},{
    toJSON: { virtuals: true},
    toObject: { virtuals: true}
});

module.exports = mongoose.model('Cart', CartSchema);