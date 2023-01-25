const mongoose = require('mongoose');


const DeviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, '{PATH} is required.'],
      trim: true,
      minlength: [3, '{PATH} must be at least {MINLENGTH} characters.'],
    },

    deviceNumber: {
      type: String,
      required: [true, '{PATH} is required.'],
      minlength: [6, '{PATH} must be at least {MINLENGTH} characters.'],
      unique: true,
      // dropDups: true,
    },

    IMEI: {
      type: String,
      required: [true, '{PATH} is required.'],
      minlength: [14, '{PATH} must be at least {MINLENGTH} characters.'],
    },

    modelNumber: {
      type: String,
      minlength: [6, '{PATH} must be at least {MINLENGTH} characters.'],
    },

    ICCID: {
      type: String,
      required: [true, '{PATH} is required.'],
      minlength: [6, '{PATH} must be at least {MINLENGTH} characters.'],
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