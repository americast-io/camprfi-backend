const { Order } = require('../models/order.model');

const {
    createOrder,
    getAllOrders,
} = require('../services/order.service');

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
    ruety84754uyeriti: {offerId: "1149", duration: 60000}
}

function timeoutFunc(delay) {
    return new Promise( res => setTimeout(res, delay) );
}


// Get All Orders from DB => /api/orders
const handleGetAllOrders = async (req, res) => {
    try{
        const orders = await getAllOrders();
        return res.json(orders);

    }catch(error) {
        return res.status(400).json(error);
    }
};

// Create a new order => /api/orders
const handleCreateOrder = async (req, res) => {
    console.log('in order controller')

    

    try{
        const {
            paymentInfo,
            productId,
            firstName,
            lastName,
            email, 
            // device,

        } = req.body;

        console.log(req.body)

        const order = await Order.create({
            paymentInfo,
            productId,
            firstName,
            lastName,
            email, 
            // device,
            paidAt: Date.now(),
        });

        return res.json(order);
    } catch(error) {

        console.log(error)

        return res.status(400).json(error);

    }
};

const handleDevicePause = async (req, res, next) => {
    console.log("making a pause request to ultramobile")

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

    const offerIdFromMap = priceToPlanMap[priceId]["offerId"];

    const timeout = priceToPlanMap[priceId]["duration"];

    const unPauseData = {
        offerIds: [
            offerIdFromMap
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

        console.log(ultraRes.status)

        //   return back object to the front end
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
    console.log(partnerTransactionId)

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

const handleDeviceUnpauseWithTimer = async (req, res, next) => {
    console.log('calling unpause in timed function')
    const priceId = req.body.priceId;

    const offerIdFromMap = priceToPlanMap[priceId]["offerId"];

    const timeout = priceToPlanMap[priceId]["duration"];

    const unPauseData = {
        offerIds: [
            offerIdFromMap
        ],
        callbackUrl: callbackUrl,
        partnerTransactionId: partnerTransactionId,

    }

    const ultraRes = await axios.post(`${unPauseUrl}${req.params.iccid}`, unPauseData, {
        headers: {
            'Authorization': `Basic ${token}`
        },
    })

    // await handleDeviceUnPauseWithOffer(req, res);

    console.log(ultraRes.status)




    await timeoutFunc(60000);

    console.log('calling pause in timed function')

    await handleDevicePause(req, res);
}


module.exports = {
    handleCreateOrder: handleCreateOrder,
    handleDevicePause: handleDevicePause,
    handleGetSubscribersByIccid: handleGetSubscribersByIccid,
    handleDeviceUnPauseWithOffer,
    handleDeviceUnpauseWithTimer: handleDeviceUnpauseWithTimer,
    handleGetAllOrders,
};