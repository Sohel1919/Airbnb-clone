const express = require("express");
const route = express.Router({mergeParams:true});
const ExpressError = require('../utils/ExpressError.js');
const wrapAsync = require('../utils/wrapAsync.js');
const {validateReview}=require('../middleware.js');
const {isLoggedIn,isReviewAuthor}=require('../middleware.js');
const reviewController = require('../controller/reviews.js');

// Post route for reviews
route.post("/", isLoggedIn, validateReview, wrapAsync (reviewController.createReview));


//Delete route for reviews
route.delete("/:reviewId", isReviewAuthor, wrapAsync(reviewController.deleteReview))


module.exports = route;