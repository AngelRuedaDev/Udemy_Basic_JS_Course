const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');


const meals = require("./routes/meals");
const orders = require("./routes/orders");
const auth = require("./routes/auth");

const app = express();

//method .use allows us to import plug-ins to our app
app.use(bodyParser.json());
app.use(cors());

//the options are needed in order to avoid a warning that says that we are working in an older version.
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});

app.use('/api/meals', meals);
app.use('/api/orders', orders);
app.use('/api/auth', auth);
module.exports = app;