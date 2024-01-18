/*
index.js


var express = require('express');
var router = express.Router();
const userModel=require("./users")
const postModel=require("./posts")


router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
  });
  
  router.get("/createuser" , async function(req,res){
    const userdata=await userModel.create({
      username: "Yatin88",
      password: "yo bro this password",
      posts: [],
      dp: "this is dp",
      email: "yatin1591.be21@chitkara.edu.in",
      fullname: "Yatin Dora",
    })
  
    res.send(userdata);
  })
  
  router.get("/createpost" , async function(req,res){
    const createpost=await postModel.create({
      postText: "hello kaise ho saare 2",
      user:"657c916ee4f32f7f80e59165"
    })
  
    let user=await userModel.findOne({_id:"657c916ee4f32f7f80e59165"})
    user.posts.push(createpost._id);
    await user.save();
    res.send("done");
  })
  
  
  router.get("/alluserpost",async function(req,res){
    let user=await userModel.findOne({_id:"657c916ee4f32f7f80e59165"}).populate("posts")
    res.send(user);
  })
  
  module.exports = router;




  user.js
  const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/pintrestClone");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref:'Post'
  }],
  dp: {
    type: String, // Assuming a URL or file path for the user's profile picture
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  fullname: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('User', userSchema);





posts.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  postText: {
    type: String,
    required: true,
  },
  user:{
    type : mongoose.Schema.Types.ObjectId,
    ref:'User'
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: Array,
    default: [],
  },
});

module.exports = mongoose.model('Post', postSchema); 
*/