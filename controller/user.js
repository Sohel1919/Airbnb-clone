const User = require('../models/user');


module.exports.renderSignupForm = (req,res)=>{
  res.render("listing/signup.ejs")
};

module.exports.signup = async(req,res,next)=>{
  try{
    let {username , email , password} = req.body;
  const newUser = new User({username , email});
  const registeredUser = await User.register(newUser,password);
  req.logIn(registeredUser,(err)=>{
    if(err){
      return next(err);
    }
    req.flash("success","Registered Successfully");
  res.redirect("/listings");
  })
  }
  catch(e){
    req.flash("error",e.message);
    res.redirect("/signup");
  }
};


module.exports.renderLoginForm = (req,res)=>{
  res.render("listing/login.ejs");
};

module.exports.login = async(req,res)=>{
  req.flash("success","Login Successfully!")
  res.redirect(res.locals.redirectUrl || "/listings");
};

module.exports.logout = (req,res,next)=>{
  req.logOut((err)=>{
    if(err){
      return next(err);
    }
    req.flash("success","You logged out successfully!");
    res.redirect("/listings");
  })
};