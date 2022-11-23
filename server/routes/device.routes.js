const express = require('express');

const {
  handleCreateDevice,
  handleGetAllDevices,
  handleGetDeviceById,
  handleDeleteDeviceById,
  handleUpdateDeviceById,
  handleGetDeviceByKeyword,
} = require('../controllers/device.controller');

const router = express.Router();

router.post('/', handleCreateDevice);


router.get('/:id', handleGetDeviceById);
// router.get('/', handleGetDeviceByKeyword);
router.get('/', handleGetAllDevices);
router.delete('/:id', handleDeleteDeviceById);
router.put('/:id', handleUpdateDeviceById);

module.exports = { deviceRouter: router };