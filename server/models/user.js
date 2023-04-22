const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  followers: [{
    type: ObjectId,
    ref: "User"
  }],
  following: [{
    type: ObjectId,
    ref: "User"
  }],
  pic:{
    type: String,
    default: "https://res.cloudinary.com/omen-india/image/upload/v1681793319/Users_Circle_Man-512_sdonrm.png"
  },
  resetToken: String,
  expireToken: Date
});

const User = mongoose.model("User", userSchema);
module.exports = User;
