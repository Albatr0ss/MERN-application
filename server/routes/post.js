const express = require("express");
const router = express.Router();
// const mongoose = require("mongoose");
const Post = require("../models/post");
const requireLogin = require("../middleware/requireLogin");

router.get("/allpost", requireLogin, (req, res) => {
  Post.find()
    .populate("postedBy", "_id name pic")
    .populate("comments.postedBy","_id name pic")
    .sort('-createdAt')
    .then((posts) => {
      res.json({ posts });
    })
    .catch((err) => {
      console.log(err);
    });
});


router.get("/subpost", requireLogin, (req, res) => {
  // checking that the field following does have the field postedBY or not
  Post.find({postedBy:{$in:req.user.following}})
    .populate("postedBy", "_id name pic")
    .populate("comments.postedBy","_id name pic")
    .sort('-createdAt')
    .then((posts) => {
      res.json({ posts });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/mypost", requireLogin, (req, res) => {
  Post.find({ postedBy: req.user._id })
    .populate("postedBy", "_id name")
    .then((mypost) => {
      res.json({ mypost });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/createpost", requireLogin, (req, res) => {
  const { title, body, pic } = req.body;
  if (!title || !body || !pic) {
    return res.status(422).json({ error: "Please fill all the fields" });
  }
  req.user.password = undefined;
  const post = new Post({
    title,
    body,
    photo: pic,
    postedBy: req.user,
  });

  post
    .save()
    .then((result) => {
      res.json({ post: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.put("/like", requireLogin, (req, res) => {
  Post.findByIdAndUpdate(req.body.postId, {
    $push: { likes: req.user._id }
    },{new: true})
    .exec().then(result =>{
      res.json({result})
    }).catch(err =>{
      return err
    })
  });
  
  
  router.put("/unlike", requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
      $pull: { likes: req.user._id }
    },{new: true})
    .exec().then(result =>{
      // console.log(result)
      res.json({result})
    }).catch(err =>{
      return err
    })
  });


router.put("/comment",requireLogin,(req,res) =>{
  const comment = {
    text: req.body.text,
    postedBy: req.user._id
  }
  Post.findByIdAndUpdate(req.body.postId,{
    $push: { comments: comment}},{new: true}
  ).populate("comments.postedBy","_id name")
  .populate("postedBy","_id name")
  .exec().then(result =>{
    // console.log(result)
  }).catch(err =>{
    return err
  })
})

router.delete("/delete/:postId", requireLogin, async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.postId }).populate(
      "postedBy",
      "_id"
    );

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.postedBy._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: "Unauthorized user" });
    }
    if(post !== null){
      // console.log(post)
      await post.deleteOne();
      res.json({ message: "Post deleted successfully" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = router;
