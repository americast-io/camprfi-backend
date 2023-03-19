const { User } = require('../models/user.model');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const sendToken = require('../utils/jwtToken');

// Register a user => /api/register
exports.registerUser = catchAsyncErrors( async (req, res, next) => {
    console.log('controller: registerUser req.body:', req.body);
    const { name, email, password } = req.body;

        const user = await User.create({
            name,
            email,
            password,
        });

    sendToken(user, 200, res);

})


// Login User => /api/login
exports.loginUser = catchAsyncErrors( async (req, res, next) => {
    const { email, password } = req.body;

    // Checks if email and password is entered by user 
    if(!email || !password) {
        return next(new ErrorHandler('Please enter email and password', 400))
    }

    // Finding user in database
    const user = await User.findOne({email}).select('+password')

    if(!user) {
        return next(new ErrorHandler('Invalid Email or Password', 401));
    }

    // Checks if password is correct or not
    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched) {
        return next(new ErrorHandler('Invalid Email or Password', 401));
    }

    sendToken(user, 200, res);

})

// Get currently logged in user details   =>   /api/auth/me
exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user
    })
})


// Logout user => /api/logout
exports.logout = catchAsyncErrors( async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: 'Logged out'
    })
})

