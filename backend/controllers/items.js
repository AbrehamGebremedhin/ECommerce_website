const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Item = require('../models/Item');

//Get ALl items
exports.getAllItems = asyncHandler( async(req,res,next) => {
    res.status(200).json(res.advancedResults);
});

//Get a single item
exports.getItem = asyncHandler( async(req,res,next) => {
    const item = await Item.findById(req.params.id);

    if(!item){
        return next(new ErrorResponse(`Item not found using ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: item
    })
});

//Add a new item to the inventory
exports.addItem = asyncHandler( async(req,res,next) => {
    const item = await Item.create(req.body)

    res.status(201).json({
        success: true,
        data: item
    })
});

//Update an item
exports.updateItem = asyncHandler( async(req,res,next) => {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: item
    })
});

//Delete an item from the inventory
exports.deleteItem = asyncHandler( async(req,res,next) => {
    const item = await Item.findByIdAndDelete(req.params.id);

    res.status(202).json({
        success: true,
        data: {}
    })
});

//Upload photo for an item 
exports.itemPhotoUpload = asyncHandler(async (req, res, next) => {
    const item = await Item.findById(req.params.id);

    //Check if the item is available
    if (!item) {
        return next(new ErrorResponse(`Item not found using ${req.params.id}`, 404));
    }
    
    //Check if files are sent
    if(!req.files){
        return next(new ErrorResponse('Please upload a file', 400));
    }

    //Sent files 
    const image1 = req.files.image1;
    const image2 = req.files.image2;

    //Checks if the files are image files
    if(!image1.mimetype.startsWith('image') && !image2.mimetype.startsWith('image')){
        return next(new ErrorResponse('Please upload an appropriate image file', 400));
    }

    //Checks file size
    if(image1.size > process.env.MAX_FILE_UPLOAD && image2.size > process.env.MAX_FILE_UPLOAD){
        return next(new ErrorResponse(`Please upload an image file less than ${process.env.MAX_FILE_UPLOAD}`, 400));
    }

    //File name
    image1.name = `itemPhoto_${item._id}${path.parse(image1.name).ext}`;
    image2.name = `itemPhoto_${item._id}${path.parse(image2.name).ext}`;

    //Moves file to the uploads folder
    image1.mv(`${process.env.FILE_UPLOAD_PATH}/${image1.name}`, async err => {
        if(err){
            console.log(err); 
            return next(new ErrorResponse('Error while upload', 500));
        }

        await Item.findByIdAndUpdate(req.params.id, {
            image1: image1.name,
        });
    })

    image2.mv(`${process.env.FILE_UPLOAD_PATH}/${image2.name}`, async err => {
        if(err){
            console.log(err); 
            return next(new ErrorResponse('Error while upload', 500));
        }

        await Item.findByIdAndUpdate(req.params.id, {
            image2: image2.name,
        });
    })

    res.status(200).json({
        success: true,
        data: "Pictures Uploaded"
    });
});