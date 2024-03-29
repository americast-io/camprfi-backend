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
// dev env
// const priceToPlanMap = {
//     price_1MK8DrJqcY7mo8Cz3fvOFN8G: {offerId: "1466", duration: 60000},
//     price_1MK8a6JqcY7mo8Czzf7jUHWA: {offerId: "1467", duration: 60000},
//     price_1MK8fMJqcY7mo8CzFmcO3CUa: {offerId: "1468", duration: 60000},
// }

// prod env
const priceToPlanMap = {
    price_1MKBklJqcY7mo8CzXoKMm06O: {offerId: "1148", duration: 60000},
    price_1MKBklJqcY7mo8CzS2dmgPFx: {offerId: "1148", duration: 60000},
    
    price_1N47XuJqcY7mo8CzyA2ARpjn: {offerId: "1149", duration: 60000},
    price_1N47XuJqcY7mo8CzW1JD3wIC: {offerId: "1149", duration: 60000},


    price_1OvrLyJqcY7mo8CzmGIf91az: {offerId: "1150", duration: 60000},
    price_1N47gxJqcY7mo8CzxQ5yUksS: {offerId: "1150", duration: 60000},

    price_1N47r2JqcY7mo8CzqnEGp4gz: {offerId: "1151", duration: 60000},
    price_1N47r2JqcY7mo8CzySyYvSfO: {offerId: "1151", duration: 60000},

    price_1N47ydJqcY7mo8Czs9b5S4mo: {offerId: "1152", duration: 60000},
    price_1N47ydJqcY7mo8CzThUiQYxV: {offerId: "1152", duration: 60000},

    price_1N48T4JqcY7mo8Czmtrbrftt: {offerId: "1153", duration: 60000},
    price_1N48T4JqcY7mo8Cz6E0pETAs: {offerId: "1153", duration: 60000},



    
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

// const handleDeviceUnpauseWithTimer = async (req, res, next) => {
//     console.log('calling unpause in timed function')
//     const priceId = req.body.priceId;

//     const offerIdFromMap = priceToPlanMap[priceId]["offerId"];

//     const timeout = priceToPlanMap[priceId]["duration"];

//     const unPauseData = {
//         offerIds: [
//             offerIdFromMap
//         ],
//         callbackUrl: callbackUrl,
//         partnerTransactionId: partnerTransactionId,

//     }

//     const ultraRes = await axios.post(`${unPauseUrl}${req.params.iccid}`, unPauseData, {
//         headers: {
//             'Authorization': `Basic ${token}`
//         },
//     })

//     // await handleDeviceUnPauseWithOffer(req, res);

//     console.log(ultraRes.status)




//     await timeoutFunc(60000);

//     console.log('calling pause in timed function')

//     await handleDevicePause(req, res);
// }

// main pause unpause functions with scheduled job 
const handleDeviceUnpausePause = async (req, res, next) => {
    console.log('calling unpause in main timed function')
    const {priceId, iccid} = req.body;
    console.log("PriceId", priceId);
    console.log("ICID", iccid);


    const offerIdFromMap = priceToPlanMap[priceId]["offerId"];
    console.log("OfferID", offerIdFromMap)

    const timeout = priceToPlanMap[priceId]["duration"];

    const unPauseData = {
        offerIds: [
            offerIdFromMap
        ],
        callbackUrl: callbackUrl,
        partnerTransactionId: partnerTransactionId,

    }

    // const resData = await handleGetSubscribersByIccid(req, res);
    // console.log("resData", resData);
    
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


    // job will start in 23 hours and 50 min and pause plan
    const job = schedule.scheduleJob('*/0 */23 * * *', async function(){
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


        const unPauseData2 = {
            offerIds: [
                "1469"
            ],
            callbackUrl: callbackUrl,
            partnerTransactionId: partnerTransactionId,
    
        }
        
        // unpause 
        console.log("calling unpause - UNPAUSE and setting plan to 1469/1GB")
        try{
            const ultraRes = await axios.post(`${unPauseUrl}${iccid}`, unPauseData2, {
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
        if (i==n) {
            
            job.cancel();
            console.log('job is finished');
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
    // handleDeviceUnpauseWithTimer: handleDeviceUnpauseWithTimer,
    handleGetAllOrders,
    handleDeviceUnpausePause,
};