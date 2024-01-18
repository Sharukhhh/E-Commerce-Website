const express = require('express');
const authRoute = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middlewares/auth');


authRoute.get('/login'  , auth.isLogged,  authController.loadLogin); 

authRoute.get('/register' ,auth.isLogged, authController.loadRegister ); 

authRoute.get('/logout' , authController.logout);


authRoute.post('/register' ,  authController.registerUser);

authRoute.post('/login' ,  authController.verfiyUserLogin);

module.exports = authRoute;