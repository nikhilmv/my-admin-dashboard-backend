const express = require('express');
const { createProduct} = require('../controllers/productController');
const { getAdminProducts} = require('../controllers/productController');
const { getYoutubeDetail, getInstaDetail, getfacebookDetail} = require('../controllers/testController'); 
 
const router = express.Router();

 
router.route('/get-youtube-detail').post(getYoutubeDetail);    
router.route('/get-insta-detail').post(getInstaDetail);    
router.route('/get-fb-detail').post(getfacebookDetail);    

module.exports = router;