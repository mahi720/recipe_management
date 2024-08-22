const mongoose = require("mongoose");
require('dotenv').config();
// const SERVER = ;
// console.log(process.env.MONGO_URL);
const connection = mongoose
  .connect('mongodb://127.0.0.1:27017/recipe-management')
  .then(() => console.log("connection established"))
  .catch((err) => console.log(err));

module.exports = { connection };


