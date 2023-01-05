const { Order } = require('../models/order.model');
const { handleCreateDevice } = require('./device.controller');




// Create a new order => /api/orders

const handleCreateOrder = async (req, res) => {
    console.log('in order controller')

    

    try{
        const {
            orderNumber,
            paymentInfo,
            productId,
            firstName,
            lastName,
            email, 
            // device,

        } = req.body;

        console.log(req.body)

        const order = await Order.create({
            orderNumber,
            paymentInfo,
            productId,
            firstName,
            lastName,
            email, 
            // device,
            paidAt: Date.now(),
        });

        // const order = await Order.create(req.body);
        return res.json(order);
    } catch(error) {

        console.log(error)

        return res.status(400).json(error);

    }
};

module.exports = {
    handleCreateOrder: handleCreateOrder,
};