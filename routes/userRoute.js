const express = require('express');
const userroute = express.Router();
const cookieparser = require('cookie-parser');
const flash = require('connect-flash')
userroute.use(cookieparser());

const session = require('express-session');
userroute.use(session({
    secret: 'sercretkey',
    resave: false,
    saveUninitialized: false,
   
}));

userroute.use(flash());
const auth = require('../middlewares/auth');

const userController = require('../controllers/userController');
const couponController = require('../controllers/couponController');




// ALL GET ROUTES
userroute.get('/under_maintenance', userController.loadNoUserMaint);

userroute.get('/user/under_coding', userController.loadMaintanencePage);

userroute.get('/'  ,  userController.loadMainPage);

userroute.get('/user',   userController.loadHomePage);              

userroute.get('/product', auth.isLogged, userController.indexProduct);

userroute.get('/search', auth.isLogged, userController.indexSearch);

userroute.get('/user/products' , auth.isBlocked, auth.isLoggedIn,  userController.loadItems);

userroute.get('/user/product_one/:id' , auth.isBlocked ,auth.isLoggedIn,  userController.loadProductView);

userroute.get('/user/profile', auth.isBlocked, auth.isLoggedIn, userController.loadUserProfile);

userroute.get('/user/wishlist' , auth.isBlocked, auth.isLoggedIn, userController.loadWishlist);

userroute.get('/user/add_wishlist/:id' , auth.isLoggedIn, userController.addToWishlist);

userroute.get('/delete/:id' , userController.removeItemWishlist);

userroute.get('/user/cart',auth.isBlocked, auth.isLoggedIn,  userController.loadCart);          

userroute.get('/user/addto_cart/:id',auth.isLoggedIn, userController.addToCart);

userroute.get('/removeItem/:id' , userController.removItemCart);

userroute.get('/user/address',auth.isBlocked,  userController.loadAddress);

userroute.get('/delete_address/:id', userController.deleteAddress);

userroute.get('/user/checkout/:id',auth.isBlocked, userController.loadCheckOut);   

userroute.get('/user/my_orders', auth.isBlocked, auth.isLoggedIn, userController.loadUserOrders);  

userroute.get('/user/my_wallet', auth.isBlocked, auth.isLoggedIn, userController.userWallet);  

userroute.get('/user/invoice/:id',auth.isBlocked, auth.isLoggedIn, userController.orderInvoice);


//paypal
userroute.get('/user/paypal-success', auth.isLoggedIn, userController.paypalSuccess);




// ALL POST ROUTES
userroute.get('/searchProduct', userController.searchProduct);

userroute.post('/incrementQuantity', userController.updatenumber);

userroute.post('/decrementQuantity', userController.decreseNumber);

userroute.post('/user/address', userController.addAddress);

userroute.post('/add_address', userController.profileAddAddress);

userroute.post('/edit_address/:id', userController.editAddress);

userroute.post('/user/order_success/:id' , auth.isLoggedIn, userController.orderPlaced);

userroute.post('/wallet_pay', userController.walletPay);

// userroute.post('/verifySignature' , userController.verifyPayment);

userroute.post('/user/ordercancel/:id', userController.orderCancel);

userroute.post('/user/return_order/:id',userController.returnOrder);

userroute.post('/redeemCoupon', couponController.redeemCoupon);





module.exports = userroute;