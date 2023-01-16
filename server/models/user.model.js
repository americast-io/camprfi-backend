// const mongoose = require('mongoose');
// const validator = require('validator');

// const userSchema = new mongoose.Schema(
//     {
//         name: {
//             type: String,
//             required: [true, 'Please enter your name'],
//             maxLength: [30, 'Your name cannot exceed {MAXLENGTH} characters']
//         },
//         email: {
//             type: String,
//             required: [true, 'Please enter your email'],
//             unique: true,
//             validate: [validator.isEmail, 'Please enter valid email address']
//         },
//         password: {
//             type: String,
//             required: [true, 'Please enter your password'],
//             minLength: [6, 'Your password must be longer then {MINLENGTH} characters'],
//             select: false
//         },
//         role: {
//             type: String,
//             default: 'user'
//         },
//         createdAt: {
//             type: Date,
//             default: Date.now
//         },
//         resetPasswordToken: String,
//         resetPasswordExpire: Date,

//     }
// );

// const User = mongoose.model('User', userSchema);

// module.exports = { User: User };

