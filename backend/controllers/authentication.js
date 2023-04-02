const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');
const sendEmail = require('../utils/sendemail');
const crypto = require('crypto');

//Register User
exports.addUser = asyncHandler( async(req, res, next) => {
    const { name, email, password, role, phone } = req.body;
    
    const user = await User.create({
        name,
        email,
        password,
        role,
        phone
    })

    sendJWT(user, 200, res);
});

//Login User
exports.loginUser = asyncHandler( async(req, res, next) => {
    const { email, password } = req.body;
    
    //Validation
    if(!email || !password) {
        return next(new ErrorResponse('Please enter an Email or password', 400))
    }

    const user = await User.findOne({ email }).select('+password');

    if(!user) {
        return next(new ErrorResponse('Invalid Email', 401));
    }

    const isCorrect = await user.matchPassword(password);

    if(!isCorrect) {
        return next(new ErrorResponse('Invalid Password', 401));
    }

    sendJWT(user, 200, res);
});

//Logout User
exports.logoutUser = asyncHandler( async(req, res, next) => {
    res.cookie('token', 'none', {
        maxAge: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        data: {}        
    })
});

//Gets logged in user information
exports.getCurrentUser = asyncHandler( async(req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        data: user        
    })
}); 

//Sends password reset token through email
exports.forgotPassword = asyncHandler( async(req, res, next) => {
    const user = await User.findOne({email: req.body.email});

    if(!user) {
        return next(new ErrorResponse(`No Such User with this ${req.body.email}`, 404));
    }

    if(user.name !== req.body.name) {
        return next(new ErrorResponse(`Entered name and the user account's name doesn't match`, 401));
    }

    user.password = req.body.newPassword;

    await user.save();

    sendJWT(user, 200, res);
}); 

//Update User Information
exports.updateUser = asyncHandler( async(req, res, next) => {
    const fieldsToUpdate = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone
    }

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: user        
    })
}); 

//Update User Password
exports.updateUserPassword = asyncHandler( async(req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    if(!(await user.matchPassword(req.body.oldPassword))){
        return next(new ErrorResponse(`Entered Current Password not correct`, 401));
    }

    user.password = req.body.newPassword;
    await user.save();

    sendJWT(user, 200, res);
}); 

const sendJWT = (user, status, res) => {
    const token = user.getSignedJwtToken();

    const options = {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7
    }

    if(process.env.NODE_ENV === 'production'){
        options.secure = true;
    }

    res
       .status(status)
       .cookie('token', token, options)
       .json({
            success: true,
            token
       })
}

