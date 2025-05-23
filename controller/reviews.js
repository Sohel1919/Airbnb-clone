const Review = require('../models/review.js');
const Listing = require('../models/listing.js');
const ExpressError = require('../utils/ExpressError.js');

module.exports.createReview = async(req,res)=>{
  let listing = await Listing.findById(req.params.id);
  let newReview = await new Review(req.body.review);
  newReview.author = req.user._id;
  listing.reviews.push(newReview);
  await listing.save();
  await newReview.save();
  req.flash("success","New Review Added!");
  res.redirect(`/listings/${listing._id}`);
}

module.exports.deleteReview = async(req,res)=>{
  let {id, reviewId}=req.params;
  await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
  await Review.findByIdAndDelete(reviewId);
  req.flash("success","Review Deleted successfully!");
  res.redirect(`/listings/${id}`);
}