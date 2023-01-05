const express = require('express');

const {
    getPriceById,
    getAllPrices

} = require('../controllers/price.controller');

const router = express.Router();

// router.route('/').post(processPayment);

router.get('/', getAllPrices);

router.get('/:id', getPriceById);

module.exports = { priceRouter: router };