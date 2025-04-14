const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require('../utils/wrapAsync.js');
const Review = require("../models/review.js");
const Listing = require('../models/listing.js');
const { isLoggedIn, validateReview } = require("../middleware.js");

// post(new) review route
router.post("/",
    isLoggedIn,
    validateReview, 
    wrapAsync(async(req, res) => {
    let listing = await Listing.findById(req.params.id);
    // if(!listing){
    //     return res.status(400).send("Review Not Found");
    // }
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    // console.log(newReview);
    // console.log("Updated listing reviews:", listing.reviews);
    await newReview.save();
    listing.reviews.push(newReview);
    await listing.save();
    req.flash("success", "New Review Created");
    res.redirect(`/listings/${listing._id}`);
}))

// delete review route
router.delete("/:reviewId",
    isLoggedIn,
    wrapAsync(async(req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted");
    res.redirect(`/listings/${id}`);
}))

module.exports = router;