const express = require('express');
const { processPayment, paytmResponse } = require('../controllers/paymentController');

const router = express.Router();

router.route('/payment/process').post(processPayment);
router.route('/callback').post(paytmResponse);
module.exports = router;