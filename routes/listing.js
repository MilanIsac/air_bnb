const express = require("express");
const router = express.Router();
const Express_Error = require('../utils/express_error.js');
const wrapAsync = require('../utils/wrapAsync.js');
const { listingSchema } = require("../schema.js");
const Listing = require('../models/listing.js');
const { isLoggedIn, isOwner } = require("../middleware.js");

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let error_msg = error.details.map((el) => el.message).join(",");
        throw new Express_Error(400, error_msg);
    }
    else {
        next();
    }
}

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
        res.render("listings/show.ejs", { listing });
    })
);

// new listing
router.post("/", isLoggedIn, validateListing,
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
            res.redirect("/listings");
        }
        // console.log(listing);
        res.render("listings/edit.ejs", { listing });
    })
);

// update listing
router.put("/:id", isLoggedIn, isOwner, validateListing,
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