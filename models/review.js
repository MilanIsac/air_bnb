const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const reveiwSchema = new Schema ({
    comment: {
        type: String,
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    }
});

module.exports = mongoose.model("review", reveiwSchema);