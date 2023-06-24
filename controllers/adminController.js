const User = require('../models/userModel');

const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const Order = require('../models/orderModel');
const Banner = require('../models/bannerModel');

const Wallet= require('../models/walletModel');

const exceljs = require('exceljs');
const session = require('express-session');
const pdf = require('html-pdf');


// const { PayloadPage } = require('twilio/lib/rest/api/v2010/account/recording/addOnResult/payload');

const loadAdminlog = async (req, res)=>{
    try {
        res.render('adminLog');
    } catch (error) {
        console.log(error);
    }
}

const adminLogout = async (req, res) => {
    try {
        req.session.admin = false;

        res.redirect('/admin');

    } catch (error) {
        console.log(error);
    }
}

const loadDashboard = async (req, res)=>{     
    try {

        const admin = req.session.admin;

        //total Users
        const totalUsers = await User.aggregate([
            {$group: {    
                _id: null, count: {$sum: 1}
            }}
        ]);


        //to get total no.of orders
        const totalOrders = await Order.aggregate([
            {$group : {
                _id : null, count : {$sum : 1}
            }}
        ]);

        //to get totalsales by summing up all the purchased products whole total
        const totalSales = await Order.aggregate([
            {
                $match: {
                  status: "Delivered",
                },
            },
              {
                $group: {
                  _id: null,
                  total: {
                    $sum: {
                      $sum: {
                        $map: {
                          input: "$item",
                          as: "item",
                          in: { $multiply: ["$$item.price", "$$item.quantity"] },
                        },
                      },
                    },
                  },
                },
              },
        ]);

        //totalsales by category
        const totalSalesByCategory = await Order.aggregate([
            { $match: { status: "Delivered" } },
            {$unwind: '$item'},

            {$lookup: {
                from: 'products',
                localField: 'item.product',
                foreignField: '_id',
                as: 'product'
            }},

            {$unwind: '$product'},
            {$lookup: {
                from: 'categories',
                localField: 'product.category',
                foreignField: '_id',
                as: 'category',
            }},

            {$unwind: '$category'},
            {$group: {
                _id: '$category._id',
                category: {$first: '$category.categname'},
                totalSales: {$sum : {$multiply : ['$item.quantity', '$product.price']}}
            }}
        ]);
        
        const deliveredCount = await Order.countDocuments({status:'Delivered'});
        const shippedcount = await Order.countDocuments({status: 'Shipped'});
        const cancelcount = await Order.countDocuments({status: 'Cancelled'});
        const pendingCount = await Order.countDocuments({status: 'Pending'});
        const refundedCount = await Order.countDocuments({status: 'Refunded'});

        //const paypal transactions recieved
        const paypalDebits = await Order.aggregate([
            {$match: {status: 'Delivered', payment_way: 'paypal'}},

            {$unwind: '$item'},

            {
                $group: {
                    _id: null,
                    total: {$sum : {$multiply : ['$item.price', '$item.quantity']}},
                },
            },
        ]);
        const totalPaypalDebits = paypalDebits.length > 0 ? paypalDebits[0].total: 0;
        


        //total amount through cash on delivery
        const  amountManually = await Order.aggregate([
            {$match: {status: 'Delivered', payment_way: 'cod'}},                       

            {$unwind: '$item'},

            {
                $group: {
                    _id: null,
                    total: { $sum: { $multiply: ['$item.price', '$item.quantity'] } },
                },
            },
        ]);
        const totalCod = amountManually.length > 0 ? amountManually[0].total: 0;



        //sales count by month
        const salesCountByMonth = await Order.aggregate([
            {$match: {status: 'Delivered'}},

            {$group: {
                _id: {
                    month: {$month: '$createdAt'},
                    year: {$year: '$createdAt'},
                },
                count: {$sum: 1},
            }},
            {$project:{
                _id: 0,
                month: '$_id.month',
                year: '$_id.year',
                count: 1
            }},
        ]);
        
        const totalUsersValue = totalUsers.length > 0 ? totalUsers[0].count: 0;
        const orderCount = totalOrders.length > 0 ? totalOrders[0].count : 0;
        const totalSalesValue = totalSales.length > 0 ? totalSales[0].total : 0;
        const categoryWiseSales = totalSalesByCategory.map((item)=>({
            category: item.category,
            totalSales: item.totalSales,
        }));
       

        res.render('dashboard',{
            admin,
            orderCount, 
            totalUsersValue, 
            totalSalesValue, 
            categoryWiseSales,
            totalPaypalDebits,
            totalCod,
            deliveredCount,
            shippedcount,
            cancelcount,
            pendingCount,
            refundedCount,
            salesCountByMonth
        });

    } catch (error) {
        console.log(error);
    }
}


const showSalesReport = async (req, res) => {
    try {
        const admin = req.session.admin;
        const salesData = await Order.find().populate('user').populate('item.product').populate('item.quantity');

        res.render('sales-report', {admin, salesData});

    } catch (error) {
        console.log(error);
    }
}

const exportSalesExcel = async (req, res) => {
    try {
        const admin = req.session.admin;
        const workbook = new exceljs.Workbook();
        const workSheet = workbook.addWorksheet('Sales Report');

        workSheet.columns = [
            { header: 'S_no.', key: 's_no.', width: 10 },
            { header: 'Date', key: 'createdAt', width: 15 },
            { header: 'OrderId', key: '_id', width: 30 },
            { header: 'Username', key: 'username', width: 20 },
            { header: 'Products', key: 'products', width: 35 },
            { header: 'Quantity', key: 'quantity', width: 10 },
            { header: 'Payment method', key: 'payment_way', width: 10 },
            { header: 'Total Amount', key: 'total', width: 10 }
        ];

        let counter = 1;
        const orderData = await Order.find().populate({path: 'user', select: 'name' }).populate( {path: 'item.product', select: 'pname'});
        orderData.forEach((order) => {
            order.s_no = counter;

            // Assuming 'username' is a property of the 'user' object
            order.username = order.user ? order.user.name : '';

            // Assuming 'products' is an array of items with 'product' and 'quantity' properties
            order.products = order.item ? order.item.map((item) => item.product.pname).join(", ") : '';

            // Assuming 'quantity' is the sum of all item quantities
            order.quantity = order.item ? order.item.reduce((total, item) => total + item.quantity, 0) : 0;

            workSheet.addRow(order);
            counter++;
        });

        workSheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true };
        });

        res.setHeader(
            "Content-Type",
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );

        res.setHeader('Content-Disposition', 'attachment; filename=sales.xlsx');
        return workbook.xlsx.write(res).then(() => {
            res.status(200);
        });
    } catch (error) {
        console.log(error);
    }
};




// .......................//

const loadProductView = async (req, res)=>{
    try {
        const admin = req.session.admin;
        const products = await Product.find().populate('category');
        const categories = await Category.find();

        res.render('products-view', {admin, products, categories});
    } catch (error) {
        console.log(error);
    }
}


const loadUserVIew = async (req, res)=>{
    try {
       
        const admin = req.session.admin;
        const usersData = await User.find();

        res.render('user-view', {
            customers: usersData
        });

    } catch (error) {
        console.log(error);
    }
}


const userBlockList = async (req, res)=> {
    try {
        const admin = req.session.admin;
        const usersData = await User.find();
        res.render('blocked-users', {customers : usersData});
    } catch (error) {
        console.log(error);
    }
}

const loadOrderDetails = async (req, res) => {
    try {
        const admin = req.session.admin;

        let page = 1;
        if(req.query.page){
            page = req.query.page;
        }

        const limit = 6;

        const orderData = await Order.find().sort({createdAt: -1}).populate('user').populate('item.product').populate('item.quantity')
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

        const count = await Order.find().populate('user').populate('item.product').populate('item.quantity')
        .countDocuments();

        res.render('order-details',{orderData,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
        });

    } catch (error) {
        console.log(error);
    }
}


// .......................................................................................................//


const verifyAdminLogin = async (req, res)=>{
    try {
        req.session.admin = true;
        const email = req.body.email;
        const password = req.body.password;
        if(email === 'adminsr@gmail.com' && password === 'admin123'){

                     
            res.redirect('/admin/dashboard');             
        }else{
            res.render('adminLog', {message : 'Invalid Entry'});
        }

    } catch (error) {
        console.log(error);
    }
}


const blockUser = async (req, res)=>{
    try {
        const userId = req.params.id;
        const shopper = await User.findById(userId);
        if(!shopper){
            res.status(404).json({message: 'user not found'});
            return;
        }

        shopper.is_blocked = true;
        await shopper.save();
        res.redirect('/admin/dashboard/users');     

    } catch (error) {
        console.log(error);
    }
}

const unBlockUser = async (req, res)=>{
    try {
        const userId = req.params.id;
        const shopper = await User.findById(userId);
        shopper.is_blocked = false;
        await shopper.save();

        res.redirect('/admin/dashboard/users');
    } catch (error) {
        console.log(error); 
    }
}
  
const updateOrderStatus = async (req, res) => {    
    try {
            
        const orderId = req.params.id;
        const selectedStatus = req.body.status;

        await Order.findByIdAndUpdate(orderId, {status : selectedStatus});

        res.redirect('/admin/dashboard/orders');

    } catch (error) {
        console.log(error);
    }
}


const refundAmount = async (req, res) => {
    try {
        const orderId = req.params.id;

        const refundingOrder = await Order.findById(orderId).populate({path: 'item.product'});
        
        if(!refundingOrder){
            res.status(404).send({message: 'Order not found'});
            return;
        }
        const wallet = await Wallet.findOne({userId: refundingOrder.user});

        //if wallet already exists, update the wallet balance of respective user
        if(wallet){
            wallet.balance += refundingOrder.total;

            wallet.transactions.push(refundingOrder.payment_way);    
            await wallet.save();
        } else {

            //else creating a new wallet for respective user
            const newWallet = await Wallet({   
                userId: refundingOrder.user,
                orderId: refundingOrder._id,
                balance: refundingOrder.total,
                transactions: refundingOrder.payment_way,
            });

            console.log(newWallet);
            await newWallet.save();

        }

        await Order.updateOne(
            {_id: orderId}, {$set: {status: 'Refunded'}}       
        );

        res.redirect('/admin/dashboard/orders');
    } catch (error) {
        console.log(error);
    }
}
 
// ..........................................................................






module.exports = {
    
    loadAdminlog, verifyAdminLogin, adminLogout,
    
    loadDashboard, showSalesReport, exportSalesExcel,

    loadProductView, loadUserVIew, userBlockList,
       
    loadOrderDetails, updateOrderStatus,
    
    refundAmount,

    blockUser, unBlockUser
    
}