var express = require('express');
var router = express.Router();
const userModel=require("./users")
const postModel=require("./post");
const passport = require('passport');
const upload=require('./multer')

const localStrategy=require("passport-local")
passport.use(new localStrategy(userModel.authenticate()))


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('signup');
});

router.get('/login' ,function(req,res,next){
  // console.log(req.flash("error"));
  res.render("login" , {error : req.flash("error")})
})


router.get('/profile' , isLoggedIn, async function(req,res,next){
  const user=await userModel.findOne({username : req.session.passport.user}).populate("posts")
  
  // console.log(user);
  
  res.render('profile' ,{user})
})

router.get('/show/posts' , isLoggedIn, async function(req,res,next){
  const user=await userModel.findOne({username : req.session.passport.user}).populate("posts")
  
  // console.log(user);
  
  res.render('show' ,{user})
})

router.get('/feed' , isLoggedIn, async function(req,res,next){
  const user=await userModel.findOne({username : req.session.passport.user})
  // console.log(user);

  const posts= await postModel.find().populate("user")
  
  res.render('feed' ,{user , posts})
})

//
router.get('/single/:id' , isLoggedIn, async function(req,res,next){
  const id = req.params.id;
  const post= await postModel.findOne({_id: id}).populate("user")
  // console.log("hello hello hello yatin yatin yatin");
  // console.log(post.image);
  // console.log(post.title);
  // res.send("ok");
  res.render('singlephoto' ,{post})
})
//

//
//

router.get("/changedName" , (req,res)=>{
  res.render("changeName")
})

router.post("/hogya" , async function(req,res){
  const {FullName} = req.body;
  
  try {
    const user=await userModel.findOneAndUpdate({username : req.session.passport.user} , {fullname:FullName})
   
    if(!user){
      res.render("changeName")
    }
    res.redirect('/profile'); // Redirect to profile page or any other page after successful update
} catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
}

})

//
//

router.get('/add' , isLoggedIn, async function(req,res,next){
  const user=await userModel.findOne({username : req.session.passport.user})
  res.render("add", {user})
})

router.post('/createpost' , isLoggedIn,upload.single("postimage"),async function(req,res,next){
  
  const user=await userModel.findOne({username : req.session.passport.user})

  const post = await postModel.create({
    user: user._id,
    title : req.body.title,
    description:req.body.description,
    image:req.file.filename
  })

  user.posts.push(post._id);
  await user.save();

  
  res.redirect("/profile")
})

router.post('/fileupload' , isLoggedIn,upload.single("image"),async function(req,res,next){
  
  const user=await userModel.findOne({username : req.session.passport.user})

  user.profileImage=req.file.filename;
  await user.save();
  res.redirect("/profile")
})



router.post("/register", function(req,res){
  const { username, email, fullname } = req.body;
  const userData = new userModel({ username, email, fullname });


  userModel.register(userData,req.body.password).then(function(){
    passport.authenticate("local")(req,res,function(){
      res.redirect("/profile")
    })
  })
})

router.post("/login", passport.authenticate("local" ,{
  successRedirect:"/profile",
  failureRedirect:'/login',
  failureFlash: true
}) ,function(req,res){
})

router.get("/logout" , function(req,res){
  req.logout(function(err){
    if(err) {return next(err)}
    res.redirect('/login')
  })
})


function isLoggedIn(req,res,next){
  if(req.isAuthenticated()) return next();
  res.redirect("/login");
}

module.exports = router;