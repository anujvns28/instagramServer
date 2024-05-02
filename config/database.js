const mongoose = require("mongoose");
require("dotenv").config();
const DATABASE_URL = process.env.DATABASE_URL;

exports.dbConnection = () => {
  mongoose.connect(DATABASE_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
  })
  .then(() => console.log("database connection is successfull"))
  .catch((error) => {
    console.log(error);
    console.log("error occured in db Connection")
  })
}