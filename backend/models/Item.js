const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name of a type']
    },
    type: {
        type: String,
        required: [true, 'Please add an item type']
    },
    price:{
        type: Number,
        required: [true, 'Please add a price for the item']
    },
    size: {
        type: String,
        required: [true, 'Please add a size for the item']
    },
    status: {
        type: Boolean,
        default: false
    },
    image1:{
        type: String,
        default: "no-photo.jpg"
    },    
    image2:{
        type: String,
        default: "no-photo.jpg"
    },    
    createdAt: {
        type: Date,
        default: Date.now
    }
},{
    toJSON: { virtuals: true},
    toObject: { virtuals: true}
});

module.exports = mongoose.model('Item', ItemSchema);