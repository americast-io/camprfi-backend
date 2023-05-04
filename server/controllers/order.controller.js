const { Order } = require('../models/order.model');
const schedule = require('node-schedule');

const {
    createOrder,
    getAllOrders,
} = require('../services/order.service');

const axios = require('axios');

const username = process.env.ULTRA_API_USERNAME;
const password = process.env.ULTRA_API_PASSWORD;

const token = Buffer.from(`${username}:${password}`, 'utf8').toString('base64')

const pauseUrl = process.env.PAUSE_URL;
const subscruberIccidurl = process.env.SUBSCRIBER_ICCID_URL;
const unPauseUrl = process.env.UNPAUSE_URL;

const callbackUrl = process.env.CALLBACK_URL;
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
            device,

        } = req.body;

        console.log(req.body)

        const order = await Order.create({
            paymentInfo,
            productId,
            firstName,
            lastName,
            email, 
            device,
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

// Unpause
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

// main pause unpause functions with scheduled job 
const handleDeviceUnpausePause = async (req, res, next) => {
    const {priceId, iccid} = req.body;


    const offerIdFromMap = priceToPlanMap[priceId]["offerId"];
    console.log(offerIdFromMap)

    const timeout = priceToPlanMap[priceId]["duration"];

    const unPauseData = {
        offerIds: [
            offerIdFromMap
        ],
        callbackUrl: callbackUrl,
        partnerTransactionId: partnerTransactionId,

    }
    
    // first we need to upause plan right away 
    try{
        console.log('calling unpause right away  outside the job - ACTIVE')
        const ultraRes = await axios.post(`${unPauseUrl}${iccid}`, unPauseData, {
            headers: {
                'Authorization': `Basic ${token}`
            },
        })

        console.log(ultraRes.status)

    }
    catch(error){
        console.log(error.data);
        return res.status(error.response.status).json({error: error.message});
    }
    
    // repeat task with cron job 
    let i = 0;
    let n = 1;


    // job will start in 5 min and pause plan
    const job = schedule.scheduleJob('*/5 * * * *', async function(){
        console.log('In job schedule!', n);
    
        // pause in order to reset intenet data
        try{
            console.log('calling pause to reset data - PAUSE')
            const ultraRes = await axios.post(`${pauseUrl}${iccid}`, data, {
                headers: {
                    'Authorization': `Basic ${token}`
                },
            })
            
        }
        catch(error){
            console.log(error);
            return res.status(error.response.status).json({error: error.message});
        }

        //waiting to unpause due to Ulta API delay (time in milliseconds)
        await timeoutFunc(60000);
        
        // unpause 
        console.log("calling unpause - UNPAUSE")
        try{
            const ultraRes = await axios.post(`${unPauseUrl}${iccid}`, unPauseData, {
                headers: {
                    'Authorization': `Basic ${token}`
                },
            })
    
            console.log(ultraRes.status)
    
        }
        catch(error){
            console.log(error.data);
            return res.status(error.response.status).json({error: error.message});
        }

        i++;
        if (i===n) {
            
            job.cancel();
        }
    });

    // await timeoutFunc(60000);

    //  // pause at the end of order
    // try{
    //     const ultraRes = await axios.post(`${pauseUrl}${iccid}`, data, {
    //         headers: {
    //             'Authorization': `Basic ${token}`
    //         },
    //     })

    //       // return back object to the front end
    //     res.status(ultraRes.status).json({
    //         success: true,
    //         message: 'success',
    //     })
        
    // }
    // catch(error){
    //     console.log(error);
    //     return res.status(error.response.status).json({error: error.message});
    // }

    return res.status(200).json({message: "order fulfilled"});

}



module.exports = {
    handleCreateOrder: handleCreateOrder,
    handleDevicePause: handleDevicePause,
    handleGetSubscribersByIccid: handleGetSubscribersByIccid,
    handleDeviceUnPauseWithOffer,
    handleDeviceUnpauseWithTimer: handleDeviceUnpauseWithTimer,
    handleGetAllOrders,
    handleDeviceUnpausePause,
};