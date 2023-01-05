
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const getAllProducts = async (req, res) => {
    console.log('Making stripe request');

    // get all products 

    const products = await stripe.products.list();
    console.log(products)
    return res.json(products);
};


module.exports = {
    getAllProducts,
}