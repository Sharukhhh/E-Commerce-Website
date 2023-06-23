const express = require('express');
const adminroute = express.Router();
require('dotenv').config();

const session = require('express-session');
adminroute.use(session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: false
}));

const auth = require('../middlewares/adminAuth');                                   
const adminController = require('../controllers/adminController');
const couponController = require('../controllers/couponController');


const bodyparser = require('body-parser');
adminroute.use(bodyparser.urlencoded({extended: true}));
adminroute.use(bodyparser.json());

adminroute.get('/' , auth.isLogged, adminController.loadAdminlog);

adminroute.get('/logout' , adminController.adminLogout);  

adminroute.get('/dashboard' , auth.isAdminLoggedIn,  adminController.loadDashboard);                         

adminroute.get('/dashboard/products', auth.isAdminLoggedIn, adminController.loadProductView);

adminroute.get('/dashboard/users', auth.isAdminLoggedIn, adminController.loadUserVIew);

adminroute.get('/dashboard/report', auth.isAdminLoggedIn, adminController.showSalesReport);     

adminroute.get('/dashboard/exportxl', adminController.exportSalesExcel);

adminroute.get('/dashboard/orders', auth.isAdminLoggedIn, adminController.loadOrderDetails);

adminroute.get('/dashboard/blocked_users', auth.isAdminLoggedIn, adminController.userBlockList);

adminroute.get('/dashboard/add_coupon' , auth.isAdminLoggedIn, couponController.loadAddCoupon);

adminroute.get('/dashboard/coupons' , auth.isAdminLoggedIn, couponController.loadCouponDetails);

adminroute.get('/dashboard/coupons/:id/delete' ,  couponController.deleteCoupon );

adminroute.get('/dashboard/coupons/:id/activate' , couponController.activateCoupon);

adminroute.get('/dashboard/coupons/:id/deactivate' , couponController.deactivateCoupon);

adminroute.get('/refund/:id', adminController.refundAmount);



adminroute.post('/' , adminController.verifyAdminLogin);

adminroute.get('/dashboard/users/:id/block', adminController.blockUser);

adminroute.get('/dashboard/users/:id/unblock', adminController.unBlockUser);

adminroute.post('/orderupdate/:id' , adminController.updateOrderStatus);



adminroute.post('/dashboard/add_coupon' , couponController.addCoupon);






module.exports = adminroute;