const mongoose = require('mongoose');
const validator = require('validator');

const Companyschema = new mongoose.Schema(
    {
    companyName: {
        type: String,
        required: [true, '{PATH} is required.'],
        minlength: [1, '{PATH} must be at least {MINLENGTH} characters.'],
        maxlength: [50, '{PATH} must be at least {MAXLENGTH} characters.'],
        unique: true,
    },

    email: {
        type: String,
        required: [false, 'Please enter your email'],
        unique: true,
        validate: [validator.isEmail, 'Please enter a valid email address']
    },

    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: false,
    }

},

{ timestamps: true } 

);

const Company = mongoose.model('Company', Companyschema);

module.exports = { Company: Company };