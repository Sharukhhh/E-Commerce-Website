const express = require('express');
const proute = express.Router();
const bodyparser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs'); 


const session = require('express-session');
proute.use(session({
    secret: 'sercretkey',
    resave: false,
    saveUninitialized: true
}));

const productController = require('../controllers/productController');

proute.use(bodyparser.urlencoded({extended: true}));
proute.use(bodyparser.json());

proute.use(express.static('public'));


// Configure multer middleware
const storage = multer.diskStorage({
    destination: function (req, file, cb) {

      // Make sure directory exists
      const uploadDir = './uploads';
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
      }
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {

      // Remove spaces and special characters from original filename
      const originalname = file.originalname.replace(/[^a-zA-Z0-9]/g, "");

      // Set filename to fieldname + current date + original filename
      cb(null, `${file.fieldname}${Date.now()}${originalname}`);
    },
  });
  
  const upload = multer({
    storage: storage,
  });

  const auth = require('../middlewares/adminAuth');   


proute.get('/dashboard/addProduct' , auth.isAdminLoggedIn, productController.loadAddProduct);

proute.get('/dashboard/editProduct/:id', auth.isAdminLoggedIn, productController.loadEditProduct);

proute.get('/dashboard/category' , auth.isAdminLoggedIn, productController.loadCategory);

proute.get('/dashboard/category_list', auth.isAdminLoggedIn, productController.loadCategoryList);

// proute.get('/dashboard/offers', auth.isAdminLoggedIn, productController.showCategoryOffers);

// proute.get('/dashboard/offers/:id/activate', productController.activateOffer);

// proute.get('/dashboard/offers/:id/deactivate', productController.deactivateOffer);

// proute.get('/dashboard/add_offer', auth.isAdminLoggedIn, productController.loadAddoffer);

proute.get('/dashboard/category_list/:id/delete', productController.deleteCategory);

proute.get('/dashboard/editCategory/:id', productController.loadEditCategory);

proute.get('/dashboard/products/:id/delete', productController.deleteProduct);

proute.get('/dashboard/add_cover', auth.isAdminLoggedIn, productController.loadAddCover);

proute.get('/dashboard/cover', auth.isAdminLoggedIn, productController.loadCoverDetails);

proute.get('/dashboard/edit_cover/:id/edit', auth.isAdminLoggedIn, productController.loadEditCover);

proute.get('/dashboard/delete_cover/:id/delete', productController.deleteCover);



proute.post('/dashboard/addProduct' , upload.array('image', 5), productController.addProduct);
 
proute.post('/dashboard/addCategory' , productController.addCategory);

// proute.post('/dashboard/add_offer', productController.addOffer);

proute.post('/dashboard/editProduct/:id',upload.array('image', 5),  productController.editProduct);

proute.post('/dashboard/editCategory/:id', productController.editCategory);

proute.post('/dashboard/add_cover', upload.single('cover'), productController.addCover);

proute.post('/dashboard/edit_cover/:id/edit', upload.single('cover'), productController.editCover);




module.exports = proute;