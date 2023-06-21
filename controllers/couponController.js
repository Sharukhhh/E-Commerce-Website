const User = require('../models/userModel');
const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const Cart = require('../models/cartModel');
const Order = require('../models/orderModel');
const Wishlist = require('../models/wishlistModel');
const Banner = require('../models/bannerModel');
const Wallet = require('../models/walletModel');
const Coupon = require('../models/couponModel');
const couponModel = require('../models/couponModel');
const session = require('express-session');

const auth = require('../middlewares/adminAuth');

require('dotenv').config();

const loadAddCoupon = async (req, res) => {
    try {
        const admin = req.session.admin;
        res.render('add-coupon');
    } catch (error) {
        console.log(error);
    }
}



const loadCouponDetails = async (req, res) => {
    try {
        const admin = req.session.admin;
        const couponData = await Coupon.find();
        res.render('view-coupon', {couponData});
    } catch (error) {
        console.log(error);
    }
}

const deleteCoupon = async (req, res) => {
    try {
        const couponId = req.params.id;
        const couponData = await Coupon.findById(couponId);
        if(!couponData){
            res.status(404).json({message: 'Coupon Not Found'});
        }

        await couponData.deleteOne();

        res.redirect('/admin/dashboard/coupons');

    } catch (error) {
        console.log(error);
    }
}

const activateCoupon = async (req, res) => {
    try{
        const couponId = req.params.id;

        // const coupon = await Coupon.findById(couponId);

        // const currentDate = new Date();
        // if(coupon.expiryDate < currentDate){
        //     return res.render('view-coupon', {message: 'The Coupon has been expired, Cannot Activate!!'});
        // }

        await Coupon.findByIdAndUpdate(couponId,
            {status: true}, 
            {new: true});

        res.redirect('/admin/dashboard/coupons');

    } catch (error){
        console.log(error);
    }
}

const deactivateCoupon = async (req, res) => {
    try {
        const couponId = req.params.id;

        await Coupon.findByIdAndUpdate(couponId,
            {status: false},
            {new: true});
        
        res.redirect('/admin/dashboard/coupons');

    } catch (error) {
        console.log(error);
    }
}

// .............................................................

const addCoupon = async (req, res) => {
    try {
        const {code, discount, description, expiryDate} = req.body;

        if(discount > 1000){
           return res.render('add-coupon', {message: 'We are not providing offer values above ₹ 1000'});
        }

        if(discount <= 0){
           return res.render('add-coupon', {message: 'Invalid discount entry. Kindly Retry'});
        }

        const currentDate = new Date();
        if(new Date(expiryDate) < currentDate){
            return res.render('add-coupon', {message: 'The Expired date has already passed. Cannot add an expired coupon'});
        }

        const newCoupon = new Coupon({
            code,
            discount,
            description,    
            expiryDate,
        });

        await newCoupon.save();

        res.redirect('/admin/dashboard/coupons');
        
    } catch (error) {
        console.log(error);
    }
}

const redeemCoupon = async (req, res) => {
    try {
        const {code} = req.body;
        const userId = req.session.user?._id;

        const coupon = await Coupon.findOne({code});
        if(!coupon){
            return res.json({success: false, message: 'Coupon Unavailable'});
        } 

        if(coupon.expiryDate < Date.now()){
            return res.json({success: false, message: 'Coupon Expired'});
        }
        
        const user = await User.findById(userId);

        if(user.coupon.includes(coupon._id)){
            return res.json({success: false, message: 'Coupon has already used'});
        }

        const cart = await Cart.findOne({user: userId});      
        let orderTotal = 0;

        for(const productItem of cart.products){
            const product = await Product.findById(productItem.productId);
            orderTotal += product.price * productItem.quantity;
        }

        if(orderTotal < coupon.discount){
            return res.json({success: false, message: 'Coupon amount exceeds cart total'});
        }

        orderTotal -= coupon.discount;

        user.coupon.push(coupon._id);
        await user.save();

        cart.total = orderTotal; 
        await cart.save();

        return res.json({success: true, discountAmount: coupon.discount, orderTotal});

    } catch (error) {

        console.log(error, "Error Occured while coupon redeem");
    }
}



module.exports = {
    
    loadAddCoupon, loadCouponDetails,
    
    addCoupon, deleteCoupon, activateCoupon, deactivateCoupon,

    redeemCoupon,
}