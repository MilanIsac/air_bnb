require('dotenv').config();
const express = require("express");
const app = express({ mergeParams: true});
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const Express_Error = require('./utils/express_error.js');
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;


const sessionOptions = {
    secret : "secret-code",
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true
    }
}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);


// app.get("/demouser", async (req, res) => {
//     let fake_user = new User({
//         email : "stud@gmail.com",
//         username : "stud1"
//     });

//     let registered_user = await User.register(fake_user, "helloworld");
//     res.send(registered_user);
// })

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


app.get("/", (req, res) => {
    res.send("abc");
})

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