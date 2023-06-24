const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


// Process stripe payment => /api/payment/process

// function that receives the request from front end where we expect the amount value and description with device id and plan details. 
// we then pass it to the Stripe to make a payment intent 
// then we return that intent back to the front end if successful or return error if request is not sucessful. 
const processPayment = async (req, res, next) => {

    console.log('Making stripe request in processPayment');

    try {
        // amount as integer in cents will come from request/event body from front end 
        const { amount, description } = req.body;


        // making a request to the Stripe server to make a payment with amount, currency and payment method type in a request body as object. 
        // We will create paymentIntents and pass it an object with amount and etc.
        const paymentIntent = await stripe.paymentIntents.create({
            amount: req.body.amount,
            currency: "usd",
            payment_method_types: ["card"],

            metadata: { integration_check: 'accept_a_payment' },
            description: req.body.description
        });

        // return back object to the front end
        res.status(200).json({
            success: true,
            client_secret: paymentIntent.client_secret
        })


    } catch (error){
        console.log({ error });

        return {
            status: 400,
            body: JSON.stringify({ error })
        }

    }
};

module.exports = {
    processPayment,
}

// we can also send Stripe API publishable key to front end from back end here, or we can keep pk in front end. 
// route /api/stripeapi
