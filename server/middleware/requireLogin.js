const jwt = require("jsonwebtoken");
// const { JWT_SECRET } = require("../key");
const User = require("../models/user");
const dotenv = require('dotenv')
dotenv.config();

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: "You must be logged in" });
  }
  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(401).json({ error: "You must be logged in" });
    }
    const id = payload;
    User.findById(id).then((userdata) => {
      req.user = userdata;
      next();
    });
  });
};
