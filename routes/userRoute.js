const express = require('express');
const { loginUser, loginUserFrontend, registerUserFrontend, addAdminUser, getAdminUser} = require('../controllers/userController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

const router = express.Router();

router.route("/login").post((req, res, next) => {
    // console.log("🔵 Request received at /api/login");
    // console.log("🔵 Request Body:", req.body);
    console.log("Request Body");
    next();
  }, loginUser);

router.route('/user/login').post(loginUserFrontend);   
router.route('/user/register').post(registerUserFrontend);   
   
router.route('/user/addadminuser').post(addAdminUser);   
router.route('/user/getadminusers').post(getAdminUser);   



module.exports = router;
