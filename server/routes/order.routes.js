const express = require('express');
const router = express.Router();

const {
    handleGetAllOrders,
    handleCreateOrder,
    handleDevicePause,
    handleGetSubscribersByIccid,
    handleDeviceUnPauseWithOffer,
    handleDeviceUnpauseWithTimer
} = require('../controllers/order.controller');

router.get('/', handleGetAllOrders);

router.get('/details/:iccid', handleGetSubscribersByIccid);

router.post('/', handleCreateOrder);
router.post('/pause/:iccid', handleDevicePause);
router.post('/unpause/:iccid', handleDeviceUnPauseWithOffer);
router.post('/upause/timer/:iccid', handleDeviceUnpauseWithTimer)

module.exports = { orderRouter: router };