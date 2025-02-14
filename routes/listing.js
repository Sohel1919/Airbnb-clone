const express = require("express");
const Router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require("../utils/ExpressError");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage })

//Require Models
const {isLoggedIn,ValidateListing}=require('../middleware.js');
const {isOwner}=require('../middleware.js');
const listingController = require("../controller/listings.js")

// Root route 
Router
  .route("/")
  .get(wrapAsync (listingController.index))
  .post(isLoggedIn, upload.single('listing[image]'), ValidateListing, wrapAsync (listingController.createListing))
  

// New listing route
Router
  .route("/new",)
  .get(isLoggedIn, listingController.renderNewForm);
Router
  .route("/search")
  .get(wrapAsync(listingController.searchListing))

Router
  .route("/:id")
  .get(wrapAsync (listingController.showListing))
  .put(isLoggedIn, isOwner, upload.single('listing[image]'), ValidateListing, wrapAsync (listingController.updateListing))
  .delete(isLoggedIn, isOwner, wrapAsync (listingController.deleteListing));

Router
  .route("/:id/edit")
  .get(isLoggedIn, isOwner, wrapAsync (listingController.renderEditForm));

module.exports = Router;