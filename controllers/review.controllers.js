const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.newReview = async(req, res) => {
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
}

module.exports.deleteReview = async(req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted");
    res.redirect(`/listings/${id}`);
}