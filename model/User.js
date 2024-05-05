const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },

    userName : {
        type: String,
        required: true,
        trim: true,   
    },

    password: {
      type: String,
      required: true,
    },
  
    additionalDetails: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Profile",
    },
    
    token: {
      type: String,
    },

    profileImage: {
      type: String,
    },
    
  }
)

module.exports = mongoose.model("User", userSchema)
