const stripe = require('stripe')('sk_test_wWqSMCHghBDAf3iUYSo7Y3Rr00XAO9ge6X');
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

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

// Send stripe API Key => /api/stripeapi
// exports.sendStripeApi = (async (req, res) => {

//     res.status(200).json({
//         stripeApiKey: "pk_test_p7pszRbUdKAmMzP7xgSFdUEN00W8pNMs2Z",
//     })

//     console.log('api key    s')
    
// });




// var request = require('request');
// var options = {
//   'method': 'GET',
//   'url': 'https://api.stripe.com//v1/products',
//   'headers': {
//     'Content-Type': 'application/x-www-form-urlencoded',
//     'Authorization': 'Bearer sk_test_wWqSMCHghBDAf3iUYSo7Y3Rr00XAO9ge6X '
//   }
// };
// request(options, function (error, response) {
//   if (error) throw new Error(error);
//   console.log(response.body);
// });