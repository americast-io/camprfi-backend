const express = require('express');
const cors = require('cors');

// Environment vars
const port = 8000;

// import all routes

const { deviceRouter } = require('./routes/device.routes');
const { productRouter } = require('./routes/product.routes');

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

app.use('/api/devices', deviceRouter);
app.use('/api/products', productRouter);

app.listen(port, () =>
    console.log(`Listening on port ${port} for REQuests to RESpond to.`)
);