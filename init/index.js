require('dotenv').config();
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const MONGO_URI = process.env.MONGO_URI;
console.log(MONGO_URI);

main()
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.log("Error connecting to DB, ", err);
    })

async function main() {
    await mongoose.connect(MONGO_URI, {
        serverSelectionTimeoutMS: 15000
    });
}

const initDB = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}

initDB();