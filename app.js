if(process.env.NODE_ENV != "production"){
  require("dotenv").config();
}
//Require Packages
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError = require('./utils/ExpressError.js');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user.js');
//Require Models
const userRouter = require('./routes/user.js');
const listingRouter = require('./routes/listing.js');
const reviewRouter = require('./routes/review.js');
const Listing = require('./models/listing.js');
const { title } = require('process');
const { listingSchema , reviewSchema} = require('./schema.js');
const Review = require('./models/review.js');
//Stablish connection with database
const dbUrl = process.env.ATLAS_DB_URL;
const secretCode = process.env.SECRET;
main()
  .then(()=>console.log("successfully connection stablish with database"))
  .catch((err)=>console.log("ERROR: ",err))
async function main() {
  await mongoose.connect(dbUrl);
}
//Set port number
const port = 8080;
//setup viewEngine & Static files
app.set("view engine","ejs");
app.engine("ejs",ejsMate)
app.set("views",path.join(__dirname,"/views"));
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'))


const store = MongoStore.create({
  mongoUrl:dbUrl,
  crypto: {
    secret:secretCode,
  },
  touchAfter: 24 * 3600,
});
store.on("error",(error)=>{
  console.log("ERROR in MONGO SESSION STORE", error)
})
const sessionOptions ={
  store,
  secret:secretCode,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expire: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly:true
  }
};

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/",(req,res)=>{
  res.send("Hi i am root")
})
//Check Server setup is working..
app.listen(port,()=>{
  console.log(`Server is listening on port no ${port}`)
});
app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
})
app.use("/listings",listingRouter);
app.use("/listings/:id/review",reviewRouter)
app.use("/",userRouter);



app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"Page Not Found !"))
})
app.use((err,req,res,next)=>{
  let {statusCode=500,message="Something Went Wrong !"}=err;
  res.render("listing/error.ejs" ,{err});
});