const express = require("express");
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const Listing = require('../models/listing.js');
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const multer = require("multer");
const upload = multer({ dest : 'uploads/' })

const listingController = require("../controllers/listing.controllers.js");


router
    .route("/")
    .get(wrapAsync(listingController.index))
    // .post(
    //     isLoggedIn,
    //     validateListing,
    //     wrapAsync(listingController.newListing)
    // );
    .post(upload.single("listing[image"), (req, res) => {
        res.send(req.file);
    })

// new form
router.get("/new", isLoggedIn, listingController.newForm);

router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn,
        isOwner,
        validateListing,
        wrapAsync(listingController.updateListing))
    .delete(isLoggedIn,
        isOwner,
        wrapAsync(listingController.deleteListing)
    );


// edit form
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.editListing)
);

module.exports = router;