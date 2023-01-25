const express = require('express');

const {
  handleCreateDevice,
  handleGetAllDevices,
  handleGetDeviceById,
  handleDeleteDeviceById,
  handleUpdateDeviceById,
  handleGetDeviceByKeyword,
} = require('../controllers/device.controller');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

const router = express.Router();

router.post('/admin', isAuthenticatedUser, authorizeRoles('admin'), handleCreateDevice);


router.get('/:id', handleGetDeviceById);
// router.get('/', handleGetDeviceByKeyword);
router.get('/', handleGetAllDevices);
router.delete('/:id/admin', isAuthenticatedUser, authorizeRoles('admin'), handleDeleteDeviceById);
router.put('/:id', handleUpdateDeviceById);

module.exports = { deviceRouter: router };