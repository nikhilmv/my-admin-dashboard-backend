const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload'); 
const connectDatabase = require("./config/database");
const dotenv = require("dotenv");

// if (process.env.NODE_ENV !== 'production') {
//   require('dotenv').config({ path: 'backend/config/config.env' });
// }

dotenv.config();

console.log("🔵 MONGO_URI:", process.env.MONGO_URI);

connectDatabase();

const app = express();

const cors = require("cors");

const allowedOrigins = [
  'http://localhost:3000',
  'https://react-ecommerce-phi-puce.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
  
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

const user = require('./routes/userRoute'); 
const product = require('./routes/productRoute');
const payment = require('./routes/paymentRoute');

const testr = require('./routes/testRoute');



app.use('/api', user);
app.use('/api', product);
app.use('/api', payment);
 
app.use('/api', testr);


const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });

module.exports = app;
