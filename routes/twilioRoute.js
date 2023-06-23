const express = require('express');
const twilioroute = express.Router();
require('dotenv').config();
const auth = require('../middlewares/auth');
const twilioController = require('../controllers/twilioController');


const session = require('express-session');
twilioroute.use(session({
    secret: 'sercretkey',
    resave: false,
    saveUninitialized: false,

}));

twilioroute.post('/sendotp' ,  twilioController.sendotp);
twilioroute.post('/verifyOtp' , twilioController.verifyOtp);                                     



module.exports = twilioroute;