const express = require("express");
const router = express.Router();

const { signup, sendOtp,uniqueUserName, login } = require("../controller/auth");



// routes for signup
router.post("/signup",signup);
// routes for sendig out
router.post("/sendOtp",sendOtp);
//login 
router.post("/login",login)
// routes for checking user in unique
router.post("/checkUsername",uniqueUserName);



module.exports = router