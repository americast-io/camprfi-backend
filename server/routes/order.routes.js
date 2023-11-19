const express = require('express');
const router = express.Router();

const {
    handleGetAllOrders,
    handleCreateOrder,
    handleDevicePause,
    handleGetSubscribersByIccid,
    handleDeviceUnPauseWithOffer,
    handleDeviceUnpauseWithTimer,
    handleDeviceUnpausePause,
} = require('../controllers/order.controller');

const { isAuthenticatedUser, isAuthenticatedPortal, authorizeRoles } = require('../middlewares/auth');

router.get('/admin', isAuthenticatedUser, authorizeRoles('admin'),  handleGetAllOrders);

// router.get('/details/:iccid', isAuthenticatedPortal, handleGetSubscribersByIccid);

router.get('/details/:iccid', handleGetSubscribersByIccid);
router.get('/', handleGetAllOrders);

router.post('/', handleCreateOrder);
router.post('/pause/:iccid', handleDevicePause);
router.post('/unpause/:iccid', handleDeviceUnPauseWithOffer);
// router.post('/upause/timer/:iccid', isAuthenticatedPortal,  handleDeviceUnpauseWithTimer);
router.post('/upausejob/schedule', handleDeviceUnpausePause)

module.exports = { orderRouter: router };