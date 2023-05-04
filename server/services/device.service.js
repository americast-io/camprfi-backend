const { Device } = require('../models/device.model');

const createDevice = async (data) => {
  const device = await Device.create(data);
  return device;
};

const getAllDevices = async () => {
  const devices = await Device.find();
  return devices;
};

const getDeviceById = async (id) => {
  const device = await Device.findById(id);
  return device;
};

const getDeviceByKeyword = async (data) => {
  const device = await Device.find({ deviceNumber: data });
  return device;
};

const deleteDeviceById = async (id) => {
  const device = await Device.findByIdAndDelete(id);
  return device;
};

const updateDeviceById = async (id, data) => {
  const device = await Device.findByIdAndUpdate(id, data, {
    runValidators: true,
    new: true,
  });

  return device;
};

module.exports = {
  createDevice: createDevice,
  getAllDevices,
  getDeviceById,
  deleteDeviceById,
  updateDeviceById,
  getDeviceByKeyword,
};