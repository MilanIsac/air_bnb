const express = require("express");
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const Listing = require('../models/listing.js');
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

// index
router.get("/",
    wrapAsync(async (req, res) => {
        const listings = await Listing.find({});
        res.render("listings/index.ejs", { listings });
    })
);

// new form
router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new.ejs");
})

// show all lisitngs
router.get("/:id",
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        const listing = await Listing.findById(id).populate("reviews").populate("owner");
        if(!listing){
            req.flash("error", "Listing does not exist");
            res.redirect("/listings");
        }
        // console.log(listing);
        // console.log("Listing reviews:", listing.reviews);
        res.render("listings/show.ejs", { listing });
    })
);

// new listing
router.post("/", 
    isLoggedIn, 
    validateListing,
    wrapAsync(async (req, res) => {
        let newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id; 
         await newListing.save();
        // console.log("listing : ", newListing);
        req.flash("success", "New Listing Created");
        res.redirect("/listings");
    })
);

// edit form
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        const listing = await Listing.findById(id);
        if(!listing){
            req.flash("error", "Listing does not exist");
            return res.redirect("/listings");
        }
        // console.log(listing);
        res.render("listings/edit.ejs", { listing });
    })
);

// update listing
router.put("/:id",
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        await Listing.findByIdAndUpdate(id, { ...req.body.listing });
        req.flash("success", "Listing Updated");
        res.redirect(`/listings/${id}`);
    })
);

// delete listing
router.delete("/:id",
    isLoggedIn,
    isOwner,
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        const deletedListing = await Listing.findByIdAndDelete(id);
        console.log("Deleted Listing: ", deletedListing);
        req.flash("success", "Listing Deleted");
        res.redirect("/listings");
    })
);

module.exports = router;