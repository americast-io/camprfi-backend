const { Order } = require('../models/order.model');

const createOrder = async (data) => {
    console.log('service: CreateOrder');

    const order = await Order.create(data);
    return order;
};

const getAllOrders = async () => {
    console.log('servcie: getAllOrders');

    const orders = await Order.find();
    return orders;
};

module.exports = {
    createOrder,
    getAllOrders,
}