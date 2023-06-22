const User = require('../models/userModel');
const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const Cart = require('../models/cartModel');
const Order = require('../models/orderModel');
const Wishlist = require('../models/wishlistModel');
const Banner = require('../models/bannerModel');
const Wallet = require('../models/walletModel');
const Coupon = require('../models/couponModel');
const Offer = require('../models/offerModel');
// const toastr = require('toastr');

const crypto = require('crypto');
require('dotenv').config();

const paypal = require('paypal-rest-sdk');

const razorpay = require('razorpay');
const {RAZORPAY_SECRET, RAZORPAY_ID } = process.env;

const instance = new razorpay({
    key_id: RAZORPAY_ID ,
    key_secret: RAZORPAY_SECRET
})



const loadMaintanencePage = async (req, res) => {
    try {
        res.render('maintenance');
    } catch (error) {
        console.log(error);
    }
}

const loadNoUserMaint = async (req, res) => {
    try {
        res.render('no-user-maintain');
    } catch (error) {
        console.log(error);
    }
} 



const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');
const { default: mongoose } = require('mongoose');
const { success, options } = require('toastr');
const { totalmem } = require('os');
const securePassword = async (password)=>{
    try {
      const hashedPassword =  await bcrypt.hash(password, 10);
      return hashedPassword;

    } catch (error) {
        console.log(error);
    }
}



const loadMainPage = async (req, res)=>{ 
    try {
        const productData = await Product.find().skip(2).limit(5);
        const bannerData = await Banner.find();
        res.render('index', {bannerData, productData});
    } catch (error) {
        console.log(error);
    }
}

const loadLogin = async (req, res)=>{
    try {
        const user = req.session.user;
        res.render('login', {user});
    } catch (error) {
        console.log(error);
    }
}


const loadRegister = async(req, res)=>{
    try {
        const user = req.session.user;
        res.render('register', {user});
    } catch (error) {
        console.log(error);
    }
}

const loadOTPlogin = async (req, res)=>{
    try {
        const user = req.session.user;
        res.render('otpLogin', {user});
    } catch (error) {
        console.log(error);
    }
}

const loadHomePage = async (req, res) => {
    try {
        const productData = await Product.find().skip(2).limit(5);
       const user = req.session.user;
       const bannerData = await Banner.find();
        res.render('home', {user, bannerData, productData}); 
          
    } catch (error) {
        console.log(error);
    }
};

const loadLogout = async (req, res)=>{
    try {
        req.session.user=false;
        req.session.destroy();
       res.redirect('/');
    } catch (error) {
        console.log(error);
    }
}


const indexProduct = async (req, res) => {
    try {
        
        const {category, sortBy, page} = req.query;

        const limit = 9;        
        let currentPage = parseInt(page) || 1;

        let query = {};

        if (category) {
            query.category = category;
        }

        const count = await Product.countDocuments(query);
        const totalPages = Math.ceil(count / limit);

        if (currentPage > totalPages) {
            currentPage = totalPages;
        }

        const skip = (currentPage - 1) * limit;

        let products;

        if(category){
            products = await Product.find(query).sort({price : sortBy === 'low-to-high' ? 1 : -1})
            .skip(skip)
            .limit(limit)
            .exec();
        } else {
            products = await Product.find().sort({price : sortBy === 'low-to-high' ? 1 : -1})
            .skip(skip)
            .limit(limit)
            .exec();
        }
        
        const categories = await Category.find();

        res.render('index-product', {products,  categories, totalPages, currentPage});    

    } catch (error) {
        console.log(error);
    }
}

const loadItems = async (req, res)=>{
    try {
        const user = req.session.user;

        const {category, sortBy, page} = req.query;

        const limit = 9;        
        let currentPage = parseInt(page) || 1;

        let query = {};

        if (category) {
            query.category = category;
        }

        const count = await Product.countDocuments(query);
        const totalPages = Math.ceil(count / limit);

        if (currentPage > totalPages) {
            currentPage = totalPages;
        }

        const skip = (currentPage - 1) * limit;           

        let products;

        if(category){
            products = await Product.find(query).sort({price : sortBy === 'low-to-high' ? 1 : -1})
            .skip(skip)
            .limit(limit)
            .exec();
        } else {
            products = await Product.find().sort({price : sortBy === 'low-to-high' ? 1 : -1})
            .skip(skip)
            .limit(limit)
            .exec();
        }
        
        const categories = await Category.find();

        res.render('products-show', {products, user, categories, totalPages, currentPage });
    } catch (error) {
        console.log(error);
    }
}

        


              
const searchProduct = async (req, res) => {
    try {
        const user = req.session.user;

        
        const {category, sortBy, page, search} = req.query;

       
        const limit = 9;        
        let currentPage = parseInt(page) || 1;

        let query = {};

        if (category) {
            query.category = category;
        }
        
        if(search){
            query.pname = {$regex: search , $options: 'i'};
        }

        const count = await Product.countDocuments(query);
        const totalPages = Math.ceil(count / limit);

        if (currentPage > totalPages) {
            currentPage = totalPages;
        }

        let skip = (currentPage - 1) * limit;       
        if(skip < 0){
            skip = 0;
        }              

        let products;

        if(category){
            products = await Product.find(query).sort({price : sortBy === 'low-to-high' ? 1 : -1})
            .skip(skip)
            .limit(limit)
            .exec();
        } else if(search){
            products = await Product.find(query).sort({price : sortBy === 'low-to-high' ? 1 : -1})
            .skip(skip)
            .limit(limit)
            .exec();
        }else{
            products = await Product.find().sort({price : sortBy === 'low-to-high' ? 1 : -1})
            .skip(skip)
            .limit(limit)
            .exec();
        }
        const categories = await Category.find();

        res.render('products-show', {products, user, categories, totalPages, currentPage });
    } catch (error) {
        console.log(error);   
    }
}



const loadProductView = async (req, res)=>{          
    try {
        const user = req.session.user;
        const productId = req.params.id;
        const product = await Product.findById(productId);

        const productData = await Product.find().skip(2).limit(5);
        if(!product){
            res.status(404).json({message: 'product unavailable'});
        }
        
        res.render('product-single', {user, product, productData });
    } catch (error) {
        console.log(error);
        res.render('404');
    }
}


const loadUserProfile = async (req, res) => {
    try {
        const userId = req.session.user?._id;
        const user = req.session.user;

        const addressData = await User.findOne({_id : userId});


        res.render('user-profile', {user,addressData: addressData.address });
    } catch (error) {
        console.log(error);
    }
}

const loadWishlist = async (req, res) => {
    try {
        const user = req.session.user;
        const userId = req.session.user?._id;

        const wishlist = await Wishlist.findOne({user: userId}).populate('items.productId');

        if(wishlist){
            const products = wishlist.items;
            const wishlistId = wishlist._id;
            res.render('wishlist' , {user, products, wishlistId}); 
        }
        
    } catch (error) {
        console.log(error);
    }
}

const userWallet = async (req, res) =>{
    try {
        const user = req.session.user;
        const userId = req.session.user?._id;

        const walletBalance = await Wallet.findOne({userId: user}).populate('orderId');
        
        const refundedOrder = await Order.find({user: user, status: 'Refunded'}).populate('item.product');

        let sum = 0;
        if(walletBalance){
            if (walletBalance.orderId && walletBalance.orderId.length > 0 && walletBalance.orderId[0].items) {
                const items = walletBalance.orderId[0].items;
            }
            sum += walletBalance.balance;
            const wallet = walletBalance.orderId;

            res.render('wallet', {user, wallet, sum, walletBalance, refundedOrder});
        } else {
            res.render('wallet',{user, wallet: 0, sum, walletBalance: 0, refundedOrder});
        }

    } catch (error) {    
        console.log(error);
    }
}

const loadCart = async (req, res)=>{ 
    try {
        const userId = req.session.user?._id;
        const user = req.session.user;
        const cart = await Cart.findOne({user: userId}).populate('products.productId');

        if(cart){
            const products = cart.products;
            const cartId = cart._id;
            res.render('cart', {user, products, cartId}); 
        } else {
            res.render('null-cart', {user});
        }
        
    } catch (error) {
        console.log(error);                   
    }
}

const loadAddress = async (req, res) => {  

    try {
        const user = req.session.user;
        const userId = req.session.user?._id;

        const cart = await Cart.findOne({user}).populate('products.productId');

        const addressData = await User.findOne({_id : userId});

        res.render('add-address', { user, cart, addressData: addressData.address});

    } catch (error) {
        console.log(error); 
    }
}



const loadCheckOut = async (req, res)=>{  
    try {
        const user = req.session.user;
        const addressId = req.params.id;
        const userId = req.session.user?._id;
        const couponData = await Coupon.find();

        const cart = await Cart.findOne({user}).populate('products.productId');

        const userData = await User.findOne(
            {_id : userId} , {address : {$elemMatch : {_id : addressId} } }
             );

             if(userData){
                const address = userData.address[0];

                res.render('checkout', {user, cart, address, couponData});
             }
    } catch (error) {
        console.log(error); 
    }
}


const walletPay = async (req, res) => {

        try {

            const user = req.session.user;
            const userId = req.session.user?._id;

            const userWallet = await Wallet.findOne({userId: userId});
            const userCart = await Cart.findOne({user: userId}).populate('products.productId');

            let totalPrice = 0;

            const items = userCart.products.map((item) => {
                const product = item.productId;
                const quantity = item.quantity;
                const price = item.productId.price;

                totalPrice += price * quantity;
            });

            const balance = (10 /100) * totalPrice;

            let walletBalance = userWallet.balance;
           
            if(balance < walletBalance){
                totalPrice -= balance;
                userCart.wallet = balance;
                await userCart.save();

                
            }

            res.json({
                success: true,
                message: 'Wallet debited successfully',              
                totalPrice,
                walletBalance,
            });
            
        } catch (error) {
            console.log(error);
        }


}

let paypalTotal = 0;


const orderPlaced = async (req, res) => {
    
    try {
        const addressId = req.params.id;                                                          
        const user = req.session.user;
        const userId = req.session.user?._id;
        const payment_method = req.body.paymentmethod;

        const userData = await User.findById(userId);

        const addressIndex = userData.address.findIndex((item) => item._id.equals(addressId));

        const selectedAddress = userData.address[addressIndex];

        const cart = await Cart.findOne({user}).populate('products.productId');

        const userWallet= await Wallet.findOne({userId: userId});

        const discount = cart.total;
        const walletDiscount = cart.wallet;

        const items = cart.products.map((item) => {      
            const product = item.productId;
            const quantity = item.quantity;
            const price = product.price;

            if(!price){
                throw error('Product price is required');                       
            }

            if (!product) {
                throw new Error("Product is required");
              }

             return { 
                product: product._id,
                quantity: quantity,
                price : price
             } ;
        });

        let totalPrice = 0; 
        items.forEach((item) => {
            totalPrice += item.price * item.quantity;
        });

        if(discount){
            totalPrice = discount;               
        }    

        if(walletDiscount){
            totalPrice -= walletDiscount;
        }
        // userWallet.balance -= balance;
        // await userWallet.save();

        if(walletDiscount){
            userWallet.balance -= walletDiscount;

            await userWallet.save();
        }


        if(payment_method == 'cod'){

            const order = new Order ({
                user: userId,
                item: items,
                total: totalPrice,
                status: 'Pending',   
                payment_way: payment_method,
                createdAt : new Date(),
                address: selectedAddress
            });
    
            await order.save();

            await cart.products.map(async(item) => {
                let newStock = item.productId.stock - item.quantity;

                await Product.findByIdAndUpdate(
                    item.productId._id, 
                    {stock: newStock},
                    {new: true}
                );
            });
    
            await Cart.deleteOne({user: userId});
    
            res.render('order-placed', {user , cart, selectedAddress, userId});
    
        }
        else if(payment_method == 'paypal'){

            if(cart.wallet){
                totalPrice -= cart.wallet;
            }

            const order = new Order ({
                user: userId,
                item: items,
                total: totalPrice,
                status: 'Pending',
                payment_way: payment_method,
                createdAt : new Date(),
                address: selectedAddress
            });       
    
            await order.save();

            await cart.products.map(async(item) => {
                let newStock = item.productId.stock - item.quantity;

                await Product.findByIdAndUpdate(
                    item.productId._id, 
                    {stock: newStock},
                    {new: true}
                );
            });
    
            cart.products.forEach((element) => {
                paypalTotal += totalPrice;
            });

            let createPayment = {
                intent: "sale",
                payer: { payment_method: "paypal" },
                redirect_urls: {
                  return_url: "http://localhost:5000/user/paypal-success",
                  cancel_url: "http://localhost:5000/user/paypal-err",
                },
                transactions: [
                  {
                    amount: {
                      currency: "USD",
                      total: (paypalTotal / 82).toFixed(2), // Divide by 82 to convert to USD
                    },
                    description: "Super User Paypal Payment",
                  },
                ],
              };
      
              paypal.payment.create(createPayment, function (error, payment) {
                if (error) {
                  throw error;
                } else {
                  for (let i = 0; i < payment.links.length; i++) {
                    if (payment.links[i].rel === "approval_url") {
                        
                      res.redirect(payment.links[i].href);
                    }
                  }
                }
              });
              
              await Cart.deleteOne({user: userId});
 

        } else if(payment_method == 'razorpay') {

            const newOrder = new Order ({
                user: userId,
                item: items,
                total: totalPrice,
                status: 'Pending',
                payment_way: payment_method,
                createdAt : new Date(),
                address: selectedAddress                  
            });   
    
            await newOrder.save();

            cart.products.forEach((element) => {
                razorpayTotal += totalPrice;
            });

            const options = {
                amount: razorpayTotal,
                currency: 'INR',
                receipt: 'order_receipt',
                payment_capture: 1
            };

            instance.orders.create(options, (err, orderr) => {
                let details = {
                    message: 'Order created',
                    order_id: "fddgd",
                    amount: razorpayTotal *  100,
                    key_id: process.env.RAZORPAY_ID,
                    product_name: cart.products,
                    user_data: {
                        name: userData.name,
                        email: userData.email,
                        contact: userData.mobile                
                    },
                }
                console.log(details,"i am detail");
                res.json({status: true, details: details});
                if(!err){
                }else{
                    res.status(404).send({success: false, message: 'Wrong in razorpay payment'});
                }
            })
        }      
      
          } catch(error){
            console.log(error);
          }

 }


 const paypalSuccess = async (req,res) => {    
    try {
        const payerId = req.query.PayerID;
        const paymentId = req.query.paymentId;
        const user = req.session.user
        const userId = req.session.user?._id;

        const execute_payment_json = {
            "payer_id": payerId,
            "transactions": [{
              "amount": {
                "currency": "USD",
                "total": paypalTotal
              }
            }]
        };

        paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) { 
            //When error occurs when due to non-existent transaction, throw an error else log the transaction details in the console then send a Success string reposponse to the user.

            if (error) {
              console.log(error.response);
              throw error;
            } else {
        
              console.log(JSON.stringify(payment));
              res.render("paypalSuccess", { payment, user, userId, });
            }});
      
    } catch (error) {
        console.log(error);
    }
 }


 const verifyPayment = async (req, res) => {
    try {
        const {razorpay_order_id,  razorpay_payment_id, razorpay_signature} = req.body.payment_method;
        let hmac = crypto.createHmac('sha256', RAZORPAY_SECRET);
        hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
        hmac = hmac.digest('hex');

        if(hmac === razorpay_signature){
            console.log('Payment Successfull');
        }else{
            console.log('Payment Failedd');
        }
    } catch (error) {
        console.log(error);
    }
 }
    


const loadUserOrders = async (req, res) => {
    try {
        const user = req.session.user;
        const userId = req.session.user?._id;

        const orderData = await Order.find({user: userId}).populate('item.product').populate('item.quantity')
        res.render('user-orders', {user, orderData});
    } catch (error) {
        console.log(error);
    }
}


const orderInvoice = async (req, res) => {
    try {    
        const user = req.session.user;
        const orderId = req.params.id;
        const userOrder = await User.find(user);

        const orderData = await Order.findById(orderId)
        .populate('item.product');

        const userAddress = await Order.findById(orderId).populate('address');

        res.render('invoice', {orderData, userOrder, userAddress, user});
    } catch (error) {
        console.log(error);
    }
}

const deleteAddress = async (req, res) => {
    try {
        const addressId = req.params.id;
        const userId = req.session.user?._id;

        const user = await User.findById(userId);
        
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const addressIndex = user.address.findIndex((address) => address._id.toString() === addressId);

    if (addressIndex === -1) {
      return res.status(404).json({ message: 'Address not found' });
    }

    user.address.splice(addressIndex, 1);

    await user.save();

    res.redirect('/user/profile');
    //  res.json({ success: true, message: 'Address deleted successfully' });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Error deleting address' });
    }
}



//................................................................................................................................//



const registerUser = async (req, res)=>{
    try{
        const { name, email, mobile, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
             return res.render('register', { message: 'Passwords do not match. Please try again.' });
          }

        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        
        if(!emailRegex.test(email)){
            return res.render('register' , {message : 'Invalid Email Entry. Retry'});
        }

        const mobileRegex = /^[1-9]\d{9}$/;

        if(!mobileRegex.test(mobile)){
            return res.render('register' , {message : 'Invalid phone number input. Retry'});
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

        if (!passwordRegex.test(password)) {
            return res.render('register', {message: 'Password requirements do not match. Retry'});
        }

        const spassword = await securePassword(req.body.password);
        const user = new User({
            name : req.body.name,
            email : req.body.email,
            mobile : req.body.mobile,
            password : spassword,
            is_blocked : false
        });

        const userData = await user.save();

        if(userData){
            return res.redirect('/login');
        }
        return res.render('register' , {message : 'Failed to Register, Try again!'});

    } catch (error) {
        console.log(error);
    }
}



const verfiyUserLogin = async (req,res)=> {
    try {
        const email =  req.body.email;
        const password = req.body.password;

        const userData = await User.findOne({email : email});

        if(userData){
           const passwordMatch = await bcrypt.compare(password, userData.password);

           if(passwordMatch){
            
                if(userData.is_blocked){
                    return res.render('login' , {message: 'Your Account is Blocked!!'});
                }


                req.session.user = userData;

                
                return res.redirect('/user');
           }else{
              return res.render('login', {message : 'Incorrect email or Password, Try again'});
           }

        }else{
          return res.render('login', {message : 'Incorrect email or Password, Try again'});
        }

    } catch (error) {
        console.log(error);
    }
};


const addToWishlist = async (req, res) => {
    try {
        const user = req.session.user;
        const userId = req.session.user?._id;

        const productId = req.params.id;

        let userWishlist = await Wishlist.findOne({user:userId });

        if(!userWishlist){
            const newList = await new Wishlist({user: userId, items: []});       
            await newList.save();

            userWishlist = newList;
        }
        const productIndex = userWishlist?.items.findIndex((item) => {

            return new ObjectId(item.productId).equals(productId);
        });

        if(productIndex == -1){
            userWishlist.items.push({productId});
            await userWishlist.save();

            
      if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        // Ajax request, send JSON response
         res.json({ success: true, message: 'Item added to Wishlist' });
      } else {
        // Non-Ajax request, redirect to the same page
         res.redirect('back');
      }
    } else {
      if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        // Ajax request, send JSON response
        res.json({ success: false, message: 'Item already in Wishlist' });
      } else {
        // Non-Ajax request, redirect to the same page
         res.redirect('back');
      }
    } 

    } catch (error) {
        console.log(error);             
    }
};




const addToCart = async (req, res) => {
    try {
        const userId = req.session.user?._id;
        
        const productId = req.params.id;

        let userCart = await Cart.findOne({user: userId});
        if(!userCart){
            const newCart = await new Cart({user: userId, products: []});
            await newCart.save();

            userCart = newCart;
        }

        const productIndex = userCart?.products.findIndex(
            (product) => product.productId == productId
          );

        if(productIndex === -1){
            userCart.products.push({productId, quantity: 1});
        } else {
            userCart.products[productIndex].quantity += 1;
        } 

        await userCart.save();

        return res.redirect('/user/cart'); 


    } catch (error) {
        console.log(error);
    }
}

const updatenumber = async (req, res) => {
    const userId = req.session.user?._id;
    const cartItemId = req.body.cartItemId;

    try {
        const cart = await Cart.findOne({user: userId}).populate('products.productId');

        const cartIndex = cart.products.findIndex((item) => item.productId.equals(cartItemId));

        if(cartIndex === -1) {
            return res.json({success: false, message: 'Cart Item not found'});
        }

        cart.products[cartIndex].quantity += 1;
        const products = cart.products[cartIndex].productId;
        const maxQuantity = products.stock;

        if(cart.products[cartIndex].quantity > maxQuantity){
            return res.json({
                success: false, message: 'Maximum Quantity Reached',
                maxQuantity
            })
        }
        
        await cart.save();

        const total = cart.products[cartIndex].quantity* cart.products[cartIndex].productId.price;
        const quantity = cart.products[cartIndex].quantity;
        // console.log(total, quantity);

        res.json({
            success: true,
            total: total,
            quantity: quantity
        })


    } catch (error) {
        console.log(error);
    }
}

const decreseNumber = async (req, res) => {
    
    const userId = req.session.user?._id;
    const cartItemId = req.body.cartItemId;

    try {
        const cart = await Cart.findOne({user: userId}).populate('products.productId');

        const cartIndex = cart.products.findIndex((item) => item.productId.equals(cartItemId));

        if(cartIndex === -1) {
            return res.json({message: 'Cart Item not found'});
        }
        cart.products[cartIndex].quantity -= 1;
        await cart.save();

        const total = cart.products[cartIndex].quantity * cart.products[cartIndex].productId.price;
        const quantity = cart.products[cartIndex].quantity;
        console.log(total, quantity);

        res.json({
            success: true,
            total: total,
            quantity: quantity
        })
        
    } catch (error) {
        console.log(error);
    }
}


const removeItemWishlist = async (req, res) => {
    try {
        const productId = req.params.id;
        const userId = req.session.user?._id;

        const userProduct = await Product.findById(productId);

        if(!userProduct){
            res.send('Product Not Found');
        }

        const userWishlist = await Wishlist.findOne({user: userId});

        if(userWishlist){
            const itemIndex = userWishlist.items.findIndex((item) => item.productId.equals(productId));

            if(itemIndex > -1){
                userWishlist.items.splice(itemIndex, 1)
                await userWishlist.save();

                res.redirect('/user/wishlist');
            } else {
                res.json('Product Not Found');
            }
        }else{
            res.json('Product Not Found');

        }
    } catch (error) {
        console.log(error);
    }
}


const removItemCart = async (req, res) => {
    try {
        const productId = req.params.id;  
        const userId = req.session.user?._id;
        const userProduct = await Product.findById(productId).select('price');

        if(!userProduct){
            res.send('Product not Found');
        }

        const userCart = await Cart.findOne({user: userId});
        const productCount = userCart.products.length - 1;

        if(userCart){
            const itemIndex=userCart.products.findIndex((item)=> item.productId.equals(productId))
      
            if(itemIndex > -1){
              userCart.products.splice(itemIndex,1)
              await userCart.save();
              res.redirect('/user/cart');
            } else {
                res.json({message: 'Product not Found'});
            }
        }else{
            res.json({message: 'Cart not Found'});
        }

    } catch (error) { 
        console.log(error);
    }
}

const profileAddAddress = async (req, res) => {
    try {
        const userId = req.session.user?._id;
        
        console.log(userId);
        const {name, state, district, phone, pincode, address, add} = req.body;

        const user = await User.findOne({ _id: userId});
        console.log(user);

        if(!user){
            res.status(404).send('USer not found');
            return;
        }

        user.address.push({name, phone, address, add, district,  state, pincode});
        await user.save();

        res.redirect('/user/profile');

    } catch (error) {
        console.log(error);
    }
}

const addAddress = async (req, res) => {
    try {
        const userId = req.session.user?._id;
        console.log(userId);
        const {name, state, district, phone, pincode, address, add} = req.body;

        const user = await User.findOne({ _id: userId});
        console.log(user);

        if(!user){
            res.status(404).send('USer not found');
            return;
        }

        user.address.push({name, phone, address, add, district,  state, pincode});
        await user.save();

        res.redirect('/user/address');

    } catch (error) {
        console.log(error);
    }
}


const editAddress = async (req, res) => {
    try {
        const userId = req.session.user?._id;
        const addressId = req.params.id;
        const { name, phone, pincode, state, district, add } = req.body;

        const user = await User.findOne({_id: userId});

        if(!user){
            return res.status(404).json({error: 'USer not found'});
        }

        const addressIndex = user.address.findIndex((address) => address._id.toString() === addressId);

        if(addressIndex === -1){
            return res.status(404).json({message: 'Address Not found'});
        }

        user.address[addressIndex].name = name;
        user.address[addressIndex].phone = phone;
        user.address[addressIndex].pincode = pincode;
        user.address[addressIndex].state = state;
        user.address[addressIndex].district = district;
        user.address[addressIndex].add = add;

        await user.save();

        res.redirect('/user/profile');
        //  res.json({ success: true, message: 'Address updated successfully' });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Error deleting address' });
    }
}



const orderCancel = async (req, res) => {
    try {
        const user = req.session.user;
        const userId = req.session.user?._id;

        const orderId = req.params.id;
        const cancelled ="Cancelled";

        await Order.findByIdAndUpdate(orderId, {status: cancelled, isCancelled: true}, {new: true});

        const orderData = await Order.find({user: userId}).populate('item.product').populate('item.quantity');
        res.render('user-orders', {user, orderData});

    } catch (error) {
        console.log('Error in order Cancel: ' , error);
    }
}

const returnOrder = async (req, res) => {
    try {
        const orderId = req.params.id;

        await Order.findByIdAndUpdate(orderId,
            {reason: req.body.reason});

        const returnData = await Order.findByIdAndUpdate(orderId,
            {status: 'Returned'}, {new: true});
            
        if(returnData){
            res.redirect('/user/my_orders');
        }    

    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    loadMaintanencePage, loadNoUserMaint,

    loadMainPage, indexProduct,

    loadLogin, loadRegister, loadOTPlogin,

    loadHomePage, loadLogout,
      
    loadItems, loadProductView, searchProduct,

    loadUserProfile,
    loadCart,
    loadWishlist,
    deleteAddress,

    userWallet, loadUserOrders, orderInvoice,

    registerUser, verfiyUserLogin,
   
    addToWishlist, removeItemWishlist,

    addToCart, updatenumber, decreseNumber, removItemCart,
      
    profileAddAddress, addAddress, editAddress,

    loadAddress, loadCheckOut,
    

    walletPay,
    orderPlaced,
    paypalSuccess,
    verifyPayment,
    orderCancel,
    returnOrder

}