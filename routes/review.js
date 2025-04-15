const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync.js');
const Review = require("../models/review.js");
const Listing = require('../models/listing.js');
const { isLoggedIn, validateReview, isReviewsAuthor } = require("../middleware.js");
const reviewController = require("../controllers/review.controllers.js");

// post(new) review route
router.post("/",
    isLoggedIn,
    validateReview, 
    wrapAsync(reviewController.newReview))

// delete review route
router.delete("/:reviewId",
    isLoggedIn,
    isReviewsAuthor,
    wrapAsync(reviewController.deleteReview))

module.exports = router;