const express = require('express');

const {
    registerUser,
    loginUser,
    logout,
    getUserProfile
} = require('../controllers/auth.controller');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth')

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logout);
router.get('/me', isAuthenticatedUser, getUserProfile);

module.exports = { authRouter: router };




