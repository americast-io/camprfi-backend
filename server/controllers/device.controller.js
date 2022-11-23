const {
    createDevice,
    getAllDevices,
    getDeviceById,
    deleteDeviceById,
    updateDeviceById,
    getDeviceByKeyword,
  } = require('../services/device.service');
  
  const handleCreateDevice = async (req, res) => {
    console.log('controller: handleCreateDevice req.body:', req.body);
  
    try {
      const device = await createDevice(req.body);
      return res.json(device);
    } catch (error) {
      return res.status(400).json(error);
    }
  };
  
  const handleGetAllDevices = async (req, res) => {
    try {
      const devices = await getAllDevices();
      if (req.query.keyword){
        console.log('controller: handleGetDeviceByKeyword req.query.keyword value:', req.query);
        try {
          const device = await getDeviceByKeyword(req.query.keyword);
          console.log('controller: handleGetDeviceByKeyword req.body:', req.query);
          return res.json(device);
        } catch (error) {
          return res.status(400).json(error);
        }
      }
      return res.json(devices);
    } catch (error) {
      return res.status(400).json(error);
    }
  };
  
  const handleGetDeviceById = async (req, res) => {
    try {
      const device = await getDeviceById(req.params.id);
      return res.json(device);
    } catch (error) {
      return res.status(400).json(error);
    }
  };

  // const handleGetDeviceByKeyword = async (req, res) => {
  //   console.log('controller: handleGetDeviceByKeyword req.query.keyword value:', req.query);
  //   try {
  //     const device = await getDeviceByKeyword(req.query.keyword);
  //     console.log('controller: handleGetDeviceByKeyword req.body:', req.query);
  //     return res.json(device);
  //   } catch (error) {
  //     return res.status(400).json(error);
  //   }
  // };
  
  const handleDeleteDeviceById = async (req, res) => {
    try {
      const device = await deleteDeviceById(req.params.id);
      return res.json(device);
    } catch (error) {
      return res.status(400).json(error);
    }
  };
  
  const handleUpdateDeviceById = async (req, res) => {
    try {
      const device = await updateDeviceById(req.params.id, req.body);
      return res.json(device);
    } catch (error) {
      return res.status(400).json(error);
    }
  };
  
  module.exports = {
    handleCreateDevice: handleCreateDevice,
    handleGetAllDevices,
    handleGetDeviceById,
    handleDeleteDeviceById,
    handleUpdateDeviceById,
    // handleGetDeviceByKeyword,
  };