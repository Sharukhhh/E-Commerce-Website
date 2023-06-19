const express = require('express');
const twilioroute = express.Router();
require('dotenv').config();
const auth = require('../middlewares/auth');
const twilioController = require('../controllers/twilioController');


const session = require('express-session');
twilioroute.use(session({
    secret: 'sercretkey',
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 300000}
}));

twilioroute.post('/sendotp' , auth.isLogged, twilioController.sendotp);
twilioroute.post('/verifyOtp' , auth.isLogged, twilioController.verifyOtp);



module.exports = twilioroute;