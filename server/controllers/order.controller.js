const { Order } = require('../models/order.model');
const { handleCreateDevice } = require('./device.controller');

const axios = require('axios');

const username = process.env.ULTRA_API_USERNAME;
const password = process.env.ULTRA_API_PASSWORD;

const token = Buffer.from(`${username}:${password}`, 'utf8').toString('base64')

const pauseUrl = 'https://connect-api.ultramobile.com/v1/connect/pause/'
const subscruberIccidurl = 'https://connect-api.ultramobile.com/v1/connect/subscriber/'
const unPauseUrl = 'https://connect-api.ultramobile.com/v1/connect/unPauseWithOffer/'

const callbackUrl = "https://api.camprfi.com/";
const partnerTransactionId = process.env.ULTRA_PARTNER_TRANSACTION_ID;

const data = {
    callbackUrl: callbackUrl,
    partnerTransactionId: partnerTransactionId,
}

const priceToPlanMap = {
    ruety84754uyeriti: "1149",
}


// Get All Orders from DB
// const handleGetAllOrders = 




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

const handleDevicePause = async (req, res, next) => {
    console.log("making an unpause request to ultramobile")

    try{
        const ultraRes = await axios.post(`${pauseUrl}${req.params.iccid}`, data, {
            headers: {
                'Authorization': `Basic ${token}`
            },
        })
          // return back object to the front end
        res.status(ultraRes.status).json({
            success: true,
            message: 'success',
        })
    }
    catch(error){
        console.log(error);
        return res.status(error.response.status).json({error: error.message});
    }
}

const handleDeviceUnPauseWithOffer = async (req, res, next) => {
    console.log("making an unpause request to ultramobile")
    const priceId = req.body.priceId;
    console.log(priceId);

    const offerId = priceToPlanMap[priceId];
    console.log(offerId);

    const unPauseData = {
        offerIds: [
            offerId
        ],
        callbackUrl: callbackUrl,
        partnerTransactionId: partnerTransactionId,

    }

    try{
        const ultraRes = await axios.post(`${unPauseUrl}${req.params.iccid}`, unPauseData, {
            headers: {
                'Authorization': `Basic ${token}`
            },
        })
          // return back object to the front end
        res.status(ultraRes.status).json({
            success: true,
            message: ultraRes.data,
        })
    }
    catch(error){
        console.log(error.data);
        return res.status(error.response.status).json({error: error.message});
    }
}

const handleGetSubscribersByIccid = async (req, res, next) => {
    console.log("making request to get subscriber by iccid ")

    try{
        const ultraRes = await axios.get(`${subscruberIccidurl}${req.params.iccid}`, {

            headers: {
                'Authorization': `Basic ${token}`
            },
        });

         // return back object to the front end
        res.status(ultraRes.status).json({
            success: true,
            message: ultraRes.data,
        })
    }
    catch(error){
        console.log(error);
        return res.status(error.response.status).json({error: error.message});
    }
}

module.exports = {
    handleCreateOrder: handleCreateOrder,
    handleDevicePause: handleDevicePause,
    handleGetSubscribersByIccid: handleGetSubscribersByIccid,
    handleDeviceUnPauseWithOffer,
};