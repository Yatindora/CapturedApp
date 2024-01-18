const mongoose = require('mongoose');
const plm=require("passport-local-mongoose")

mongoose.connect("mongodb://127.0.0.1:27017/pintrestClone");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String
  },
  boards: {
    type:Array,
    default:[]
  },
  profileImage: {
    type: String, // Assuming a URL or file path for the user's profile picture
    // default : "https://i.pinimg.com/564x/58/35/ad/5835ad685f4b81eb269a395cbf212b40.jpg"
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
  posts:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref : "post"
    }
  ]
});

userSchema.plugin(plm);

module.exports = mongoose.model('User', userSchema);