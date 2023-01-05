const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const getPriceById = async (req, res) => {
    console.log('Making stripe request for price by id');

    try {
         // get price by id 
        const price = await stripe.prices.retrieve(req.params.id);
        console.log(price)
        return res.json(price);

    } catch (error) {

        console.log({ error });

        return {
            status: 400,
            body: JSON.stringify({ error })
                }
    };
};

const getAllPrices = async (req, res) => {
    console.log("Making stripe request to retrieve all prices")

    try {
        // get all prices
        const prices = await stripe.prices.list({ limit: 50});
        console.log(prices);
        return res.json(prices);

    }catch (error) {
        console.log({ error });

        return {
            status: 400,
            body: JSON.stringify({ error })
        }

    };
};


module.exports = {
    getPriceById,
    getAllPrices,
}
