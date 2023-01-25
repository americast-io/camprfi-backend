const express = require('express');
const cors = require('cors');

const cookieParser = require('cookie-parser');


const errorMiddleware = require('./middlewares/errors');

// Environment vars
const port = 8000;

const dotenv = require('dotenv');

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
app.use(cors());

// req.body undefined without this!
app.use(express.json());
app.use(cookieParser());

app.use('/api/devices', deviceRouter);
app.use('/api/products', productRouter);
app.use('/api/payment/process', paymentRouter);
app.use('/api/orders', orderRouter);
app.use('/api/prices', priceRouter);
app.use('/api/auth', authRouter);

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