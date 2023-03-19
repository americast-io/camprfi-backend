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

const { isAuthenticatedUser, isAuthenticatedPortal, authorizeRoles } = require('../middlewares/auth');

router.get('/admin', isAuthenticatedUser, authorizeRoles('admin'),  handleGetAllOrders);

router.get('/details/:iccid', isAuthenticatedPortal, handleGetSubscribersByIccid);

router.post('/', handleCreateOrder);
router.post('/pause/:iccid', isAuthenticatedPortal,  handleDevicePause);
router.post('/unpause/:iccid', isAuthenticatedPortal, handleDeviceUnPauseWithOffer);
router.post('/upause/timer/:iccid', isAuthenticatedPortal,  handleDeviceUnpauseWithTimer)

module.exports = { orderRouter: router };