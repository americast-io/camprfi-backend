const mongoose = require('mongoose');


const DeviceSchema = new mongoose.Schema(
  {
    // lowercase letters 6
    deviceNumber: {
      type: String,
      required: [true, '{PATH} is required.'],
      minlength: [6, '{PATH} must be at least {MINLENGTH} characters.'],
      maxlength: [6, '{PATH} must be at least {MAXLENGTH} characters.'],
      unique: true,
      // dropDups: true,
    },
    
    imei: {
      type: String,
      required: [true, '{PATH} is required.'],
      minlength: [14, '{PATH} must be at least {MINLENGTH} characters.'],
    },

    modelNumber: {
      type: String,
      required: [true, '{PATH} is required.'],
      minlength: [6, '{PATH} must be at least {MINLENGTH} characters.'],
    },

    iccid: {
      type: String,
      required: [true, '{PATH} is required.'],
      minlength: [6, '{PATH} must be at least {MINLENGTH} characters.'],
    },

    wifiName: {
      type: String,
    },

    wifiPassword: {
      type: String
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    }
    
  },
  { timestamps: true } 
);


const Device = mongoose.model('Device', DeviceSchema);


module.exports = { Device: Device };