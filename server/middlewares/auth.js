const jwt = require("jsonwebtoken");
const { User } = require("../models/user.model");

const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");


// Checks if user is authenticated or not 
exports.isAuthenticatedUser = catchAsyncErrors( async (req, res, next) => {
    // let token;

    // if(
    //     req.headers.authorization &&
    //     req.headers.authorization.startsWith('Bearer')
    // ) {
    //     token = req.headers.authorization.split(' ')[1]

    // }

    // else if (req.cookies.token) {
    //     token = req.cookies.token
    // }
    console.log("in authorization")
    console.log(req.headers)
    console.log(req.cookies)
    const { token } = req.cookies

    if(!token) {
        return next(new ErrorHandler('Login to access this resource.', 401))
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id);

    next();

})

// Handling users roles
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)){
            return next(
            new ErrorHandler(`Role (${req.user.role}) is not allowed to access this resource.`,
            403))
        }
        next()
    }
}

// Checks if portal is authenticated or not 
exports.isAuthenticatedPortal = catchAsyncErrors( async (req, res, next) => {

    const { token } = req.headers.authorization.split(' ')[1]

    if(!token) {
        return next(new ErrorHandler('Login to access this resource.', 401))
    }

    const username = process.env.CAMPRFI_API_USERNAME;
    const password = process.env.CAMPRFI_API_PASSWORD;
    const token2 = Buffer.from(`${username}:${password}`, 'utf8').toString('base64')

    if (token !== token2) {
        return next(new ErrorHandler('Access denied.', 401))
    }

    next()

})