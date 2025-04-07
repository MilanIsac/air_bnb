const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const review = require("./review.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    image: {
        filename: { type: String, default: "listingimage" },
        url: {
            type: String,
            default: "https://images.unsplash.com/photo-1739361133037-77be66a4ea6a?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        }
    },
    
    price: {
        type: Number,
    },
    location: {
        type: String,
    },
    country: {
        type: String,
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "review",
        }
    ],
    owner: {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
    }
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if(listing){
        await review.deleteMany({_id: { $in : listing.reviews}});
    }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;