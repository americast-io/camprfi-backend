const express = require('express');

const {
    processPayment,

} = require('../controllers/paymentController');

const router = express.Router();

// router.route('/').post(processPayment);

router.post('/', processPayment);

module.exports = { paymentRouter: router };
