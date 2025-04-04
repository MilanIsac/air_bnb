const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require('../utils/wrapAsync.js');
const Express_Error = require('../utils/express_error.js');
const {reviewSchema} = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require('../models/listing.js');

const validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let error_msg = error.details.map((el) => el.message).join(",");
        throw new Express_Error(400, error_msg);
    }
    else{
        next();
    }
}

// post(new) review route
router.post("/", validateReview, wrapAsync(async(req, res) => {
    let listing = await Listing.findById(req.params.id);
    if(!listing){
        return res.status(400).send("Review Not Found");
    }
    let newReview = new Review(req.body.review);
    await newReview.save();
    listing.reviews.push(newReview);
    await listing.save();
    req.flash("success", "New Review Created");
    res.redirect(`/listings/${listing._id}`);
}))

// delete review route
router.delete("/:reviewId", wrapAsync(async(req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted");
    res.redirect(`/listings/${id}`);
}))

module.exports = router;