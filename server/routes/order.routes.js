const express = require('express');
const router = express.Router();

const {
    handleCreateOrder,
} = require('../controllers/order.controller');


router.post('/', handleCreateOrder);

module.exports = { orderRouter: router };