const Otp = require("../model/Otp");
const User = require("../model/User");
const otpGenerator = require("otp-generator");
const emailSendMail = require("../utility/emailSend");
const Profile = require("../model/Profile");
const bcrypt = require("bcrypt")

exports.sendOtp = async(req,res) => {
    try{
    const {email} = req.body;
    if(!email){
        return res.status(500).json({
            success:false,
            message:"Email is required"
        })
    }

    const user = await User.findOne({email:email});

    if(user){
     return res.status(500).json({
        success:false,
        message:"user is alreday exist"
     })
    }

    const otp = otpGenerator.generate(6, 
        { upperCaseAlphabets: false, 
         specialChars: false ,
         lowerCaseAlphabets:false
    });

    await Otp.create({
        email:email,
        otp:otp,
        createdAt:Date.now()
    })

    // send mail
    emailSendMail(email,"Otp Varifaction",otp)


    return res.status(200).json({
        success:true,
        message:"Otp Sent success fully"
    })

    }catch(error){
        console.log(error,"error occured in sending otp")
        return res.status(500).json({
            success:false,
            message:"error occered in seding otp"
        })
    }
}

exports.uniqueUserName = async(req,res) => {
    try{
      const {email} = req.body;
      let expactedUserNameArr = []

      if( !email){
        return res.status(500).json({
          success:false,
          message:"email is required"
        })
      }

      const user = await User.findOne({email:email});
      if(user){
        return res.status(500).json({
          success:false,
          message:"user is alredy rejusterd"
        })
      }

      

      let expactedName = email.split("@")[0];
      while (expactedUserNameArr.length < 2)  {
        const user = await User.findOne({userName:expactedName});
        if(!user){
          expactedUserNameArr.push(expactedName)
          expactedName = expactedName+(Math.floor(Math.random()))
        }

      }

      console.log(expactedUserNameArr,"this is expactedName")
      

      return res.status(200).json({
        success:true,
        message:"Try this one",
        usernames:expactedUserNameArr
      })

    }catch(error){
        console.log(error,"error occured username")
        return res.status(500).json({
            success:false,
            message:"error occered in username"
        })
    }
}



exports.signup = async (req,res) => {
    try {
      // Destructure fields from the request body
      const {
        fullName,
        username,
        email,
        password,
        dateOfBirth,
        otp,
      } = req.body

      console.log(
        fullName,
        username,
        email,
        password,
        dateOfBirth,
        otp,)
      // Check if All Details are there or not
      if (
        !fullName ||
        !username ||
        !email ||
        !password ||
        !otp ||
        !dateOfBirth
      ) {
        return res.status(403).send({
          success: false,
          message: "All Fields are required",
        })
      }
      
      // Check if user already exists
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User already exists. Please sign in to continue.",
        })
      }
  
      // Find the most recent OTP for the email
      const response = await Otp.find({ email }).sort({ createdAt: -1 }).limit(1)
      
      console.log(response)
      if (response.length === 0) {
        // OTP not found for the email
        return res.status(400).json({
          success: false,
          message: "The OTP is not valid",
        })
      } else if (otp !== response[0].otp) {
        // Invalid OTP
        return res.status(400).json({
          success: false,
          message: "The OTP is not valid",
        })
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10)
  
      // Create the Additional Profile For User
      const profileDetails = await Profile.create({
        gender: null,
        dateOfBirth: dateOfBirth,
        about: null,
      })
      const user = await User.create({
        name:fullName,
        userName:username,
        email,
        password: hashedPassword,
        additionalDetails: profileDetails._id,
        image: undefined,
      })
  
      return res.status(200).json({
        success: true,
        user,
        message: "User registered successfully",
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "User cannot be registered. Please try again.",
      })
    }
  }


  exports.login = async (req, res) => {
    try {
      // Get email and password from request body
      const { username, password } = req.body
      console.log(req.body)
  
      // Check if username or password is missing
      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: `Please Fill up All the Required Fields`,
        })
      }
  
      // Find user with provided username
      const user = await User.findOne({ email }).populate("additionalDetails")
  
     
      if (!user) {
        return res.status(401).json({
          success: false,
          message: `User is not Registered with Us Please SignUp to Continue`,
        })
      }
  
      // Generate JWT token and Compare Password
      if (await bcrypt.compare(password, user.password)) {
        const token = jwt.sign(
          { email: user.email, id: user._id, accountType: user.accountType },
          process.env.JWT_SECRET,
          {
            expiresIn: "24h",
          }
        )
  
        user.token = token
        user.password = undefined
        
  
        const options = {
          expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          httpOnly: true,
        }
  
        res.cookie("token", token, options).status(200).json({
          success: true,
          token,
          user,
          message: `User Login Success`,
        })
      } else {
        return res.status(401).json({
          success: false,
          message: `Password is incorrect`,
        })
      }
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: `Login Failure Please Try Again`,
      })
    }
  }  

   