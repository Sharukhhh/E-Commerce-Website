const express = require('express');
const adminroute = express.Router();
require('dotenv').config();

const session = require('express-session');
adminroute.use(session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: true
}));

const auth = require('../middlewares/adminAuth');                                   
const adminController = require('../controllers/adminController');
const couponController = require('../controllers/couponController');


const bodyparser = require('body-parser');
adminroute.use(bodyparser.urlencoded({extended: true}));
adminroute.use(bodyparser.json());

adminroute.get('/' , adminController.loadAdminlog);

adminroute.get('/dashboard' ,  adminController.loadDashboard);                         

adminroute.get('/dashboard/products', adminController.loadProductView);

adminroute.get('/dashboard/users', adminController.loadUserVIew);

adminroute.get('/dashboard/report', adminController.showSalesReport);     

adminroute.get('/dashboard/exportxl', adminController.exportSalesExcel);

adminroute.get('/dashboard/orders', adminController.loadOrderDetails);

adminroute.get('/dashboard/blocked_users', adminController.userBlockList);

adminroute.get('/dashboard/add_coupon' , couponController.loadAddCoupon);

adminroute.get('/dashboard/coupons' , couponController.loadCouponDetails);

adminroute.get('/dashboard/coupons/:id/delete' , couponController.deleteCoupon );

adminroute.get('/dashboard/coupons/:id/activate' , couponController.activateCoupon);

adminroute.get('/dashboard/coupons/:id/deactivate' , couponController.deactivateCoupon);

adminroute.get('/refund/:id', adminController.refundAmount);



adminroute.post('/' , adminController.verifyAdminLogin);

adminroute.get('/dashboard/users/:id/block', adminController.blockUser);

adminroute.get('/dashboard/users/:id/unblock', adminController.unBlockUser);

adminroute.post('/orderupdate/:id' , adminController.updateOrderStatus);



adminroute.post('/dashboard/add_coupon' , couponController.addCoupon);






module.exports = adminroute;