const exp = require('constants');
const express = require('express');
const path = require('path');
const app = express();
const session = require('express-session');
const bodyparser = require('body-parser');
const cookieparser = require('cookie-parser');
const nocache = require('nocache');
const flash = require('connect-flash')
require('dotenv').config();
const paypal = require('paypal-rest-sdk');
const authRoutes = require('./routes/authRoutes');
const userroutes = require('./routes/userRoute');
const adminroutes = require('./routes/adminRoute');
const productRoutes = require('./routes/productRoute'); 

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const MONGO_URL = process.env.MONGO_URL;

//database connection
const mongoose = require('mongoose');
mongoose.connect(MONGO_URL)
.then(()=> console.log('Connected to Database'))
.catch(err=> console.log(err));

app.use(flash());          
app.use(nocache())

const PORT = process.env.PORT || 3000;  

app.set('view engine' , 'ejs');
app.set('views', [
    __dirname + '/views/admin',
    __dirname + '/views/user',
    __dirname + '/views/partials' 

]);
app.use(cookieparser());

app.use(session({
  secret: 'secretkey',
  resave: false,
  saveUninitialized: false,
  cookie: {maxAge: 3600000}
}));

app.use(express.static('uploads'));

app.use((req, res, next) => {
    res.setHeader(
      'Cache-Control', 'no-cache, no-store, must-revalidate' 
    );
    next();
  });

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));



//load static pages
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, 'public/index/css')));
app.use('/images', express.static(path.join(__dirname, 'public/index/images')));
app.use('/js', express.static(path.join(__dirname, 'public/index/js')));
app.use('/fonts', express.static(path.join(__dirname, 'public/index/fonts')));


// for authentication related routes
app.use('/' , authRoutes);

//for userside routes
app.use('/', userroutes);

//for adminside routes
app.use('/admin' , adminroutes);

//for products
app.use('/admin' , productRoutes);




paypal.configure({
  'mode':'sandbox',
  'client_id':PAYPAL_CLIENT_ID,
  'client_secret':PAYPAL_CLIENT_SECRET
  
});               
              
app.use((req, res, next) => {
  res.status(404);          
  res.render('404');                           
});

// app.use('/admin', (req, res, next) => {
//   res.status(404);
//   res.render('error');
// });


app.listen(PORT, (req, res)=>{
    console.log(`http://localhost:${PORT}`);    
});