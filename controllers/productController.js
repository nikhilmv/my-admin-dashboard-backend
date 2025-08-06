const Product = require('../models/productModel');
const asyncErrorHandler = require('../middlewares/asyncErrorHandler');
// const cloudinary = require('cloudinary');
const cloudinary = require('../config/cloudinary');  // Path to the file where you exported the cloudinary configuration
 

// Get All Products ---ADMIN
exports.getAdminProducts = asyncErrorHandler(async (req, res, next) => {
    const products = await Product.find();

    res.status(200).json({
        success: true,
        products,
    });
});

exports.createProduct = asyncErrorHandler(async (req, res, next) => {
    let images = [];
    if (typeof req.body.images === "string") {
        images.push(req.body.images);
    } else {
        images = req.body.images;
    }
 

    const result = await cloudinary.uploader.upload(req.body.logo, {
        folder: "brands",
    });
    const brandLogo = {
        public_id: result.public_id,
        url: result.secure_url,
    };
    req.body.brand = {
        name: req.body.brandname,
        logo: brandLogo
    } 

    const imagesLink = []; 
    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.uploader.upload(images[i], {
            folder: "products",
        });

        imagesLink.push({
            public_id: result.public_id,
            url: result.secure_url,
        });
    }
    req.body.images = imagesLink;

    req.body.user = req.body.userid;

    let specs = [];
    req.body.specifications.forEach((s) => {
        specs.push(JSON.parse(s))
    });
    req.body.specifications = specs;
    const product = await Product.create(req.body);
 
    res.status(201).json({
        success: true,
        product, 
    });

});

// Delete Product ---ADMIN
exports.deleteProduct = asyncErrorHandler(async (req, res, next) => {

    const product = await Product.findById(req.params.id);

    if (!product) { 
        res.status(404).json({
            success: false,
            message: "Product Not Found", 
        });
    }

    for (let i = 0; i < product.images.length; i++) {
        await cloudinary.uploader.destroy(product.images[i].public_id);
    }

    await product.deleteOne();

    res.status(201).json({
        success: true,
        message: "Product deleted successfully",
    });
 
});


exports.getUserProducts = asyncErrorHandler(async (req, res, next) => {
    
    let query = Product.find();
    const productsCount = await Product.countDocuments();
    const { keyword, category, minPrice, maxPrice, ratings, page = 1 } = req.query;

    //   Search by keyword (name, description, etc.)
    if (keyword) {
        query = query.find({
            name: { $regex: keyword, $options: "i" }, // Case-insensitive search
        });
    }

      //   Filter by category
      if (category) {
        query = query.find({
            category: { $regex: category, $options: "i" }, // Case-insensitive search
        }); 
    }

        //   Filter by price range
        if (minPrice !== undefined && maxPrice !== undefined) {
            query = query.find({
                price: { $gte: Number(minPrice), $lte: Number(maxPrice) },
            });
        }

        if (ratings) {
            query = query.find({ ratings: { $gte: Number(ratings) } });
        }

        const filteredquery = query.clone();   
        const filteredqueryy = await filteredquery; 
         
    //   Pagination
    
    const limit = 10; // Set a default page size
    const skip = (Number(page) - 1) * limit;

    query = query.skip(skip).limit(limit); 
        
    // Execute query
    const products = await query;
 
    res.status(200).json({
        success: true, 
        products,
        resultPerPage: limit,
        productsCount: productsCount,
        filteredProductsCount: filteredqueryy.length,
    });


});

exports.getUserProductDetail = asyncErrorHandler(async (req, res, next) => {

    const product = await Product.findById(req.params.id);
    if (!product) { 
        res.status(404).json({
            success: false,
            message: "Product Not Found", 
        });
    }
    res.status(200).json({
        success: true,
        product,
    });
});

