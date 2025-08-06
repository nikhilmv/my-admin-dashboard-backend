const asyncErrorHandler = require('../middlewares/asyncErrorHandler');
const PaytmChecksum = require("paytmchecksum");


exports.processPayment = asyncErrorHandler(async (req, res, next) => {

    const { amount, email, phoneNo } = req.body;

    const orderId = "ORDER_" + Date.now();
    const mid = process.env.PAYTM_MID;
    const key = process.env.PAYTM_MERCHANT_KEY;

    const paytmParams = {
        MID: mid,
        WEBSITE: process.env.PAYTM_WEBSITE,
        INDUSTRY_TYPE_ID: process.env.PAYTM_INDUSTRY_TYPE,
        CHANNEL_ID: process.env.PAYTM_CHANNEL_ID,
        ORDER_ID: orderId,
        CUST_ID: email,
        TXN_AMOUNT: "1",
        CALLBACK_URL: process.env.PAYTM_CALLBACK_URL,
        EMAIL: email,
        MOBILE_NO: phoneNo,
      }; 
   
        let checksum  = PaytmChecksum.generateSignature(paytmParams, key);
        checksum.then(function (checksum) {
  
            res.status(201).json({ ...paytmParams, CHECKSUMHASH: checksum });
    
        }).catch(function (error) {
            console.log(error);
            res.status(500).json({ error: "Checksum generation failed" });
        }); 

});


// Paytm Callback
exports.paytmResponse = (req, res, next) => {

    console.log(req.body);

    
   
}

