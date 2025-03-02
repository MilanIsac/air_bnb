require('dotenv').config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require('./models/listing.js');
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require('./utils/wrapAsync.js');
const Express_Error = require('./utils/express_error.js');
const {listingSchema, reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

main()
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.log("Error connecting to DB, ", err);
    })

async function main() {
    await mongoose.connect(MONGO_URI);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
    res.send("abc");
})

const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let error_msg = error.details.map((el) => el.message).join(",");
        throw new Express_Error(400, error_msg);
    }
    else{
        next();
    }
}
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

// new
app.post("/listings", validateListing,
    wrapAsync(async (req, res, next) => {
    let newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
})
);

// edit
app.get("/listings/:id/edit", 
    wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    console.log(listing);
    res.render("listings/edit.ejs", { listing });
}))

// update
app.put("/listings/:id", validateListing, 
    wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
}))

// delete
app.delete("/listings/:id", 
    wrapAsync(async (req, res) => {
    let { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log("Deleted Listing: ", deletedListing);
    res.redirect("/listings");
}))

// review
app.post("/listings/:id/reviews", validateReview, wrapAsync(async(req, res) => {
    let listing = await Listing.findById(req.params.id);
    if(!listing){
        res.status(400).send("Review Not Found");
    }
    let newReview = new Review(req.body.review);
    await newReview.save();
    listing.reviews.push(newReview);
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
}))

app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async(req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete();
    res.redirect(`/listings/${id}`);
}))

app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
})

app.get("/listings/:id", 
    wrapAsync (async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing });
}))

app.get("/listings", 
    wrapAsync(async (req, res) => {
    const listings = await Listing.find({});
    res.render("listings/index.ejs", { listings });
}));

// app.get("/test", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "my home",
//         description: "dsvjdjvkdsv",
//         // image: "",
//         price: 123,
//         location: "ahmedabad",
//         country: "india",
//     });

//     await sampleListing.save();
//     console.log("Data saved");
//     res.send("test was success");
// });

app.all("*", (req, res, next) => {
    next(new Express_Error(404, "Page Not Found"));
})

app.use((err, req, res, next) => {
    let {statusCode = 500, message = "Something went wrong"} = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs", { message });
});

app.listen(PORT, () => {
    console.log(`Server is running on port : ${PORT}`);
})