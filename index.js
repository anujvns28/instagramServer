const express = require("express");
const { dbConnection } = require("./config/database");
const app = express();
const fileUpload = require("express-fileupload")
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const emailSendMail = require("./utility/emailSend");



const PORT = process.env.PORT || 4000;

//middleware
app.use(express.json());


app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

app.use(cors({
    origin:"*",
    credentials:true
}))

//mounting
app.use("/api/v1/auth",authRoutes);


// database connection
dbConnection()

// start server
app.listen(PORT,() => {
    console.log("Server started successfully")
})




