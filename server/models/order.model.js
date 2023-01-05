const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
    {
        orderNumber: {
            type: String,
            required: [false, '{PATH} is required'],
        },

        paymentInfo: {
            id: {
                type: String,
            },
            status: {
                type: String
            },
            
        },

        productId: {
            type: String,
            required: false,
        },

        orderTimer: {
            type: Date,
        },

        orderStatus: {
            type: String,
            required: false,
            default: 'Processing',
        },
        firstName: {
            type: String,
            required: [true, '{PATH} is required'],
        },
        lastName: {
            type: String,
            required: [false, 'Last name is required'],
        },
        email: {
            type: String,
            required: [false, 'Email is required'],
        },
        device: {
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref: 'Device',
        },

        paidAt: {
            type: Date,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        }

    },
    { timestamps: true } 

);

const Order = mongoose.model('Order', OrderSchema);

module.exports = { Order: Order};