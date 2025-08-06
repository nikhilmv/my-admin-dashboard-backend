const User = require('../models/userModel');
const asyncErrorHandler = require('../middlewares/asyncErrorHandler');
const sendToken = require('../utils/sendToken');
const ErrorHandler = require('../utils/errorHandler');
const bcrypt = require('bcryptjs');
const cloudinary = require('../config/cloudinary');  // Path to the file where you exported the cloudinary configuration

  
exports.loginUser = asyncErrorHandler(async (req, res, next) => {
   
    
    const { email, password } = req.body;
 
    if(!email || !password) { 
        res.status(400).json({
            success: false,
            message: "Please Enter Email And Password", 
        }); 
    }
  
    const user = await User.findOne({ email, role:"admin"}).select("+password");
    console.log("🔵 User found:", user);
    
    if(!user) { 
        res.status(404).json({
            success: false,
            message: "user not found", 
        }); 
    }
    // bcrypt.hash("password123", 10).then(console.log);

    const isPasswordMatched = await user.comparePassword(password);
    if(!isPasswordMatched) {
 
        res.status(404).json({
            success: false,
            message: "Invalid Email or Password", 
        }); 
    }
    sendToken(user, 201, res);
  
});


exports.registerUserFrontend = asyncErrorHandler(async (req, res, next) => {
    const { name, email, password, gender, avatar } = req.body;
 

    const checkUserExist = User.find({ email, role:"user"});
    if(checkUserExist) {
        res.status(404).json({
            success: false,
            message: "User already exists with this email", 
        }); 
    }
    const result = await cloudinary.uploader.upload(avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
    });
 
    const user = await User.create({
        name, 
        email,
        gender,
        password,
        avatar: {
            public_id: result.public_id,
            url: result.secure_url,
        },
    }); 
    
    res.status(201).json({
        success: true,
        message: "User registered successfully", 
        user,
    });
});

exports.loginUserFrontend = asyncErrorHandler(async (req, res, next) => {
    const { email, password } = req.body;
    if(!email || !password) {
        return next(new ErrorHandler("Please Enter Email And Password", 400));
    }
    const user = await User.findOne({ email, role:"user"}).select("+password");
    if(!user) {
        res.status(404).json({
            success: false,
            message: "user Not Found", 
        }); 
    }

    const isPasswordMatched = await user.comparePassword(password);
    if(!isPasswordMatched) {
 
        res.status(404).json({
            success: false,
            message: "Invalid Email or Password", 
        }); 
    }
    sendToken(user, 201, res);
});


exports.addAdminUser = asyncErrorHandler(async (req, res, next) => {

    const { name, email, gender, role, dob, avatar } = req.body;
    const password = Math.random().toString(36).slice(-8);
    const checkUserExist = await User.findOne({ email });
     console.log(req.body);
    
    if (checkUserExist) {
        return res.status(409).json({
            success: false,
            message: "User already exists with this email", 
        }); 
    }

    try { 
        const result = await cloudinary.uploader.upload(avatar, {
            folder: "avatars",
            width: 150,
            crop: "scale",
        });
        console.log("Cloudinary Upload Result:", result); 
        const user = await User.create({
            name, 
            email,
            gender,
            role,
            dob,
            password,
            avatar: {
                public_id: result.public_id,
                url: result.secure_url,
            },
        });

        res.status(201).json({
            success: true,
            message: "User registered successfully", 
            user,
        });
    } catch (err) { 
        return res.status(200).json({
            success: false,
            message: "Image upload/data store failed",
            error: err.message,
        });
    }
  
});
exports.getAdminUser = asyncErrorHandler(async (req, res, next) => {
  
    let query = User.find();
    const usersCount = await User.countDocuments();
    const {  page = 1 } = req.query;
  

    const filteredquery = query.clone();   
    const filteredqueryy = await filteredquery; 


    //  Pagination
    
    const limit = 5; // Set a default page size
    const skip = (Number(page) - 1) * limit;

    query = query.skip(skip).limit(limit); 
    // Execute query
    const users = await query;

    res.status(200).json({
        success: true, 
        users,
        resultPerPage: limit,
        usersCount: usersCount,
        filteredUsersCount: filteredqueryy.length,
    });
});
