const express = require('express');
const router = express.Router();

const {
    handleCreateOrder,
    handleDevicePause,
    handleGetSubscribersByIccid,
    handleDeviceUnPauseWithOffer,
} = require('../controllers/order.controller');

router.get('/details/:iccid', handleGetSubscribersByIccid);

router.post('/', handleCreateOrder);
router.post('/pause/:iccid', handleDevicePause);
router.post('/unpause/:iccid', handleDeviceUnPauseWithOffer);

module.exports = { orderRouter: router };