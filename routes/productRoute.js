const express = require('express');
const { createProduct} = require('../controllers/productController');
const { getAdminProducts} = require('../controllers/productController');
const { getUserProducts} = require('../controllers/productController');
const { getUserProductDetail} = require('../controllers/productController');
const { deleteProduct} = require('../controllers/productController');
// const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

const router = express.Router();


// router.route('/admin/product/new').post(isAuthenticatedUser, authorizeRoles("admin"), createProduct);
router.route('/admin/product/add-product').post(createProduct);   
router.route('/admin/product/get-admin-products').get(getAdminProducts);   
router.route('/admin/product/delete-product/:id').delete(deleteProduct);

router.route('/user/product/get-products').get(getUserProducts); 
router.route('/user/product/get-product-detail/:id').get(getUserProductDetail); 

module.exports = router;