const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');


const errorMiddleware = require('./middlewares/errors');

// Environment vars
const port = 8000;

const dotenv = require('dotenv');

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Handle Uncaught exceptions
process.on('uncaughtException', err => {
    console.log(`ERROR: ${err.stack}`);
    console.log('Shutting down due to uncaught exception');
    process.exit(1)
} )


dotenv.config();




// import all routes

const { deviceRouter } = require('./routes/device.routes');
const { productRouter } = require('./routes/product.routes');
const { paymentRouter } = require('./routes/payment.routes');
const { orderRouter } = require('./routes/order.routes');
const { priceRouter } = require('./routes/price.routes');
const { authRouter } = require('./routes/auth.routes');

// requiring / importing runs the file!
// This file doesn't need to export anything though, so we need a var.
require('./config/mongoose.config');

// app is a function but it also has key value pairs on it like an object.
const app = express();

/* 
app.use is adding 'middleware':
stuff that happens in the middle of the the request and response.
*/

// avoid CORS error since our front-end is running on a different port
// so our requests are 'cross origin' port 3000 -> 8000
var  corsOptions  = {
    // origin: 'http://localhost:3000', //frontend url
    origin: 'http://3.83.146.55', //frontend url
    credentials: true}
app.use(cors(corsOptions));

// req.body undefined without this!
app.use(express.json());
app.use(cookieParser());

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiting 
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 mins
    max: 100
});

app.use(limiter);

// Prevent http param pollution
app.use(hpp());


// Mount routers
app.use('/api/v1/devices', deviceRouter);
app.use('/api/v1/products', productRouter);
app.use('/api//v1/payment/process', paymentRouter);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/prices', priceRouter);
app.use('/api/v1/auth', authRouter);

// Middleware to handle errors
app.use(errorMiddleware);


const server = app.listen(port, () =>
    console.log(`Listening on port ${port} for REQuests to RESpond to in ${process.env.NODE_ENV} mode.`)
);

// Handle Unhandled Promise rejections
process.on('unhandledRejection', err => {
    console.log(`ERROR: ${err.message}`);
    console.log('Shutting down the server due to Unhandled Promise rejection');
    server.close(() => {
        process.exit(1)
    })
})