require('dotenv').config()
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const router = require('./router/index.js')
const errorMiddleware = require('./middlewares/error-middleware')
const fileUpload = require('express-fileupload')

const PORT = process.env.PORT || 5000;
const app = express();

app.use(fileUpload({}))
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL,
  secure: true
}));
app.use('/api', router)
app.use(errorMiddleware)

const start = async () => {
  try {
    app.listen(PORT, () => console.log(`SERVER STARTED ON PORT ${process.env.CLIENT_URL}`))
  } catch (err) {
    console.log(err)
  }
}

start();