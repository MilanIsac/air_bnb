const express = require("express");
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const Listing = require('../models/listing.js');
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const listingController = require("../controllers/listing.controllers.js");


// index
router.get("/",
    wrapAsync(listingController.index));

// new form
router.get("/new", isLoggedIn, listingController.newForm);

// show all lisitngs
router.get("/:id",
    wrapAsync(listingController.showListing));

// new listing
router.post("/",
    isLoggedIn,
    validateListing,
    wrapAsync(listingController.newListing)   
);

// edit form
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.editListing)
);

// update listing
router.put("/:id",
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(listingController.updateListing)
);

// delete listing
router.delete("/:id",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.deleteListing)
);

module.exports = router;