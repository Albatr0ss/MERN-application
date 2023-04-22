const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const  JWT_SECRET  = require("../keys.env");
const crypto = require("crypto")
// const SENDGRID = require("../keys.env")
const dotenv = require('dotenv')
dotenv.config();

const nodemialer = require("nodemailer")
const sendgridTransport = require("nodemailer-sendgrid-transport")

const transporter = nodemialer.createTransport(sendgridTransport({
  auth:{
    api_key: process.env.SENDGRID_API
  }
}))

router.post("/signup", (req, res) => {
  const { name, email, password,pic } = req.body;
  if (!name || !email || !password) {
    return res.status(422).send("Please enter email/password");
  }
  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        return res.status(409).json({ err: "User already exist" });
      }
      bcrypt.hash(password, 10).then((hashedPassword) => {
        const user = new User({
          name,
          email,
          password: hashedPassword,
          pic
        });
        user
          .save()
          .then((user) => {
            transporter.sendMail({
              to: user.email,
              from: "igclone.123@gmail.com",
              subject:"successfully signed up",
              html: `<h1>Hello ${user.name}, welcome to Sociofy </h1> <p> This is an AI generated mail. Do not reply to this</p>`
            })
            res.json({ message: "saved successfully" });
          })
          .catch((err) => {
            console.log(err);
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "Enter emial/password" });
  }
  User.findOne({ email: email })
    .then((savedUser) => {
      if (!savedUser) {
        return res.status(422).json({ error: "Invalid Email/Password" });
      }
      bcrypt.compare(password, savedUser.password).then((match) => {
        if (match) {
          const {email,name,followers,following,pic} = savedUser;
          const id = savedUser.id;
          const token = jwt.sign(id, process.env.JWT_SECRET);
          res.json([{ auth: true, token, user:{
            id,name,email,followers,following,pic
          } }]);
        } else {
          return res.status(422).json({ error: "Invalid Email/Password" });
        }
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/resetpass",(req,res) =>{
  crypto.randomBytes(32,(err,buffer) =>{
    if(err){
      console.log(err)
    }else{
      // console.log(buffer)
      const token = buffer.toString("hex")
      User.findOne({emial: req.body.email})
      .then((user) =>{
        if(!user){
          return res.status(422).json({error: "user not found"})
        }else{
          user.resetToken = token;
          user.expireToken = Date.now() + 600
          user.save().then((result) =>{
            transporter.sendMail({
              to: user.email,
              from: "igclone.123@gmail.com",
              subject:"Password Reset",
              html: `
              <p>You requested for password reset</p>
              <h5>Click this <a href="http://localhost:3001/reset/${token}"> link</a> to reset your password</h5>
              `
            })
          })
        }
      })
    }
  })
})

module.exports = router;
