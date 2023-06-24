const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const bannerModel = require('../models/bannerModel');
const Offer = require('../models/offerModel');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const session = require('express-session');

const auth = require('../middlewares/adminAuth');


const loadAddProduct = async (req, res)=>{
    try {
        const admin = req.session.admin;
        const categories = await Category.find();

        res.render('add-product', {categories}); 
    } catch (error) { 
        console.log(error);
    }
}

const loadEditProduct = async(req, res)=>{  
    try {
        const admin = req.session.admin;

        const pId = req.params.id;
        const item = await Product.findById(pId);

        const categories = await Category.find();

        res.render('update-product', {item, categories});
        
    } catch (error) {
        console.log(error);
    }
}


const loadCategory = async (req, res)=>{
    try {
        const admin = req.session.admin;
        res.render('add-category');
    } catch (error) {
        console.log(error);
    }
}


const  loadCategoryList = async (req, res)=> {
    try {
        const admin = req.session.admin;
        const categories = await Category.find();
        
        res.render('category-list', {categories});
    } catch (error) {
        console.log(error);
    }
}

const loadEditCategory = async (req, res) => {
    try {
        const admin = req.session.admin;
        const categoryId = req.params.id;
        const category = await Category.findById(categoryId);
       
        

        res.render('edit-category', {category});
    } catch (error) {
        console.log(error);
    }
}

// const showCategoryOffers = async (req, res) => {
//     try {
//         const admin = req.session.admin;
//         const categoryOffers = await Offer.find().populate('category','categname');

//         res.render('list-catoffers', {categoryOffers});
//     } catch (error) {
//         console.log(error);
//     }
// }

// const loadAddoffer = async (req, res) => {
//     try {
//         const admin = req.session.admin;
//         const categories = await Category.find();

//         res.render('add-offers', {categories});
//     } catch (error) {
//         console.log(error);
//     }
// }

loadAddCover = async (req, res) => {    
    try {
        const admin = req.session.admin;
        res.render('add-banner');
    } catch (error) {
        console.log(error);                
    }
}


loadCoverDetails = async(req, res) => {
    try {
        const admin = req.session.admin;
        const bannerData = await bannerModel.find();

        res.render('show-banner',{bannerData});
    } catch (error) {
        console.log(error);
    }
}


loadEditCover = async (req, res) => {
    try {
        const admin = req.session.admin;
        res.render('edit-banner');
    } catch (error) {
        console.log(error);        
    }
}
// ...........................................................................................................

// const addOffer = async (req, res) => {
//     try {
//         const categories = await Category.find();
//         const {category, description, amount, expiryDate } = req.body;


//         if(amount<= 0) {
//             return res.render('add-offers', {categories, message: 'Invalid Amount entry'});
//         }

//         const currentDate = new Date();
//         if(new Date(expiryDate) < currentDate){
//             return res.render('add-offers', {categories, message: 'The Expired date has already passed. Cannot add an expired offer'});
//         }

//         const categoryObj = await Category.findOne({ _id: category });

//         if (!categoryObj) {
//             return res.render('add-offers', { categories, message: 'Invalid category selection' });
//         }

//         const newOffer = new Offer({
//             category:  categoryObj._d,
//             description,
//             amount,
//             expiryDate
//         });

//         await newOffer.save();
//         res.redirect('/admin/dashboard/offers')
//     } catch (error) {
//         console.log(error);
//     }
// }


// const activateOffer = async (req, res) => {
//     try {
//         const offerId = req.params.id;

//         await Offer.findByIdAndUpdate(offerId,
//             {status: true},
//             {new: true}
//             );

//             res.redirect('/admin/dashboard/offers');
//     } catch (error) {
//         console.log(error);
//     }
// }


// const deactivateOffer = async (req, res) => {
//     try {
//         const offerId = req.params.id;

//         await Offer.findByIdAndUpdate(offerId,
//             {status: false},
//             {new: true}
//             );

//             res.redirect('/admin/dashboard/offers');
//     } catch (error) {
//         console.log(error);
//     }
// }



const addCategory = async (req, res)=>{
    try {
        const {category} = req.body;
                                                           
        const predefinedCategories = ["Men", "Women", "Kids"];

        const isLowerCase = predefinedCategories.includes(category.toLowerCase());
        const isUpperCase = predefinedCategories.includes(category.toUpperCase());
    
        if (!isLowerCase && !isUpperCase) {
          const mixedCaseCategory = predefinedCategories.find((predefinedCategory) =>
            predefinedCategory.toLowerCase() === category.toLowerCase()
          )
      
          if (mixedCaseCategory) {
            return res.render('add-category', { message: 'Invalid Category Entry. Retry' });
          }


        if(/\s/ .test(category)){
            return res.render('add-category', {message: 'No white Spaces are allowed'});
        }

        if(/[^a-zA-Z0-9]/ .test(category)){
            return res.render('add-category', {message: 'Invalid Category Entry. Retry'});
        }

        const existingCategory = await Category.findOne({categname: category});

        if(existingCategory){

           return res.render('add-category', {message: 'Entered Category Already Exists'});
        }

        const newCategory = new Category({
            categname:  category
        });

        await newCategory.save();

        res.redirect('/admin/dashboard/category_list');
    }else{
        return res.render('add-category', {message: 'Entered Category Already Exists'});
    }
    } catch (error) {
        console.log(error);
    }
}

const deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await Category.findById(categoryId);
        
        if(!category){
            res.render('category-list', {message: 'Category Not Found'});
        }

        await category.deleteOne();
        res.redirect('/admin/dashboard/category_list'); 

    } catch (error) {
        console.log(error);
    }
}

const editCategory = async (req, res) => {
    try {
        const categories = await Category.find();
        

        const categoryId = req.params.id;
        const category = await Category.findById(categoryId);

        const updatedCategoryName = req.body.category;

        if (/\s/.test(updatedCategoryName)) {
            return res.render('edit-category', {category, message: 'No white spaces are allowed' });
        }

        if (/[^a-zA-Z0-9]/.test(updatedCategoryName)) {
            return res.render('edit-category', {category, message: 'Invalid Category Entry. Retry' });
        }

        const existingCategory = await Category.findOne({ categname: updatedCategoryName });

        if (existingCategory && existingCategory._id.toString() !== categoryId) {
            return res.render('edit-category', {category,  message: 'Entered Category Already Exists' });
        }

        const updateCategory = await Category.findByIdAndUpdate(categoryId,
            {
                categname: req.body.category
            }, {new: true});

            await updateCategory.save();

            if(updateCategory){
                return res.redirect('/admin/dashboard/category_list');
            }else{
                return res.redirect('/admin/dashboard');
            }
        
    } catch (error) {
        console.log(error);
    }
}





const addProduct = async (req, res)=>{ 
    try {
        const categories = await Category.find();
        const {pname, category, brand, stock, details, price} = req.body;
        const imgFiles = req.files;

        if(price <= 0){
            return res.render('add-product', {categories, message: 'Invalid Price Value, Try Again'});
        }

        if(stock <= 0){
            return res.render('add-product', {categories, message: 'Invalid Stock Entry'});
        }

        const imagePaths = [];  

        for(const file of imgFiles){
            const { path, filename } = file;

            // const pathArray = path.split('\\');
            // const fileName= pathArray[pathArray.length - 1];

            //Resize and crop image to fixed size
            const resziedImageBuffer = await sharp(path)
            .resize({width: 1920, height: 960, fit: 'cover'})
            .toBuffer();

            const croppedFileName = `cropped_${filename}`;
            const croppedFilePath = `uploads/${croppedFileName}`;

            await sharp(resziedImageBuffer).toFile(croppedFilePath);

            imagePaths.push(croppedFileName);
        }

        const categoryObj = await Category.findOne({categname: category});  
        const categoryId = categoryObj._id;

        const newProduct = new Product({
            pname,
            category: categoryId,
            brand,
            stock,
            details,
            image: imagePaths,
            price 
        });

        await newProduct.save();
        res.redirect('/admin/dashboard/products');

    } catch (error) {
        console.log(error);
    }
}



const deleteProduct = async (req, res)=>{
    try {
        const productId = req.params.id;
        const item = await Product.findById(productId);

        if (!item) {
            res.status(404).json({ message: 'Product not found' });
            return;
        }

        await item.deleteOne(); 

        if (req.xhr || req.headers.accept.indexOf('json') > -1){
            res.json({message: 'Product Deleted successfully'})
        }else{
             res.redirect('back');
        }

       

    } catch (error) {
        console.log(error);
    }
}


const editProduct = async (req, res) => {
    try {
        const pId = req.params.id;  
        const item = await Product.findById(pId);

        const categories = await Category.find();
        const updatedPrice =  req.body.price;

        const stockUpdate = req.body.stock;

        if(updatedPrice <= 0){
            return res.render('update-product', {item, categories, message: 'Price value cannot be negative!'});
        }

        if(stockUpdate <= 0){
            return res.render('update-product', {item, categories, message: 'Invalid Stock Entry' });
        }

        let newImages = item.image;

        if(req.files && req.files.length > 0){
            newImages = [];

            for(const file of req.files){
                const { path } = file;

                const pathArray = path.split('\\');
                const fileName = pathArray[pathArray.length - 1];

                const resizedImageBuffer = await sharp(path)
                .resize({ width: 1920, height: 960, fit: 'cover' })
                .toBuffer();
                
                const croppedFileName = `cropped_${fileName}`;
                const croppedFilePath = `uploads/${croppedFileName}`;

                await sharp(resizedImageBuffer).toFile(croppedFilePath);

                newImages.push(croppedFileName);
            }

            for (const image of item.image) {
                if(image && image !== null){
                    try {
                        fs.unlinkSync(`uploads/${image}`);
                      } catch (error) {
                        console.log(error);
                      }
                 }

              }
            } else {
              newImages.push(req.body.image);
            }

        const updateProduct = await Product.findByIdAndUpdate(pId,
            {
                pname: req.body.pname,
                details: req.body.details,
                brand: req.body.brand,
                stock: stockUpdate,
                price: updatedPrice,
                category: req.body.category,
                image: newImages

            }, {new: true} );

            
            
            // await updateProduct.save();

            if(updateProduct){   
                return res.redirect('/admin/dashboard/products');
            }else{
                return res.redirect('/admin/dashboard');
            }

            

    } catch (error) {
        console.log(error);
    }
}


const addCover = async (req, res) => {
    try {
        const {title, note} = req.body;
        const { filename } = req.file;

        const croppedImageBuffer = await sharp(req.file.path)
        .resize(1920, 1080, { fit: 'cover' })
        .toBuffer();

        const croppedFilename = `cropped_${filename}`;
        await sharp(croppedImageBuffer)
          .toFile(`uploads/${croppedFilename}`);

        const newBanner = new bannerModel({
            cover: croppedFilename,
            title,
            note
        });

         await newBanner.save();

        res.redirect('/admin/dashboard/cover');

    } catch (error) {
        console.log(error);
    }
}





const deleteCover = async (req, res) => {
    try {
        const bannerId = req.params.id;
        const banner = await bannerModel.findById(bannerId);
        const bannerData = await bannerModel.find();

        if(!banner){
            res.render('show-banner', {bannerData});
        }

        await banner.deleteOne();

        res.redirect('/admin/dashboard/cover');

    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    
    loadAddProduct, loadEditProduct,
   
    loadCategory, loadCategoryList, loadEditCategory,
  
    loadAddCover, loadCoverDetails, loadEditCover,

    addCategory, deleteCategory, editCategory,

    addProduct, deleteProduct, editProduct,

    addCover, deleteCover

}