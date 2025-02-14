const express = require("express");
const Router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl}=require('../middleware.js');
const userController = require("../controller/user.js");

Router
  .route("/signup")
  .get(userController.renderSignupForm)
  .post(wrapAsync(userController.signup));

Router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(saveRedirectUrl,
  passport.authenticate('local',{ failureRedirect:'/login',failureFlash:true}), 
  wrapAsync(userController.login));

Router.get("/logout", userController.logout)

module.exports = Router;