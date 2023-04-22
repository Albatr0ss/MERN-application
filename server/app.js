const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const { mongoURI } = require("./key");
const cors = require('cors');
const dotenv = require('dotenv')
dotenv.config();

mongoose.connect(process.env.MONGOURI);
mongoose.connection.on("connected", (err) => {
  if (err) throw err;
  console.log("connected successfully");
});

const UserSchema = require("./models/user")
const PostSchema = require("./models/post")

app.use(express.json());
app.use(cors());
app.use(require("./routes/auth"));
app.use(require("./routes/post"));
app.use(require("./routes/user"));

app.listen(3001, () => {
  console.log("server is running on port 3001!");
});
