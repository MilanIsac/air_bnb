const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
})

router.post("/signup", wrapAsync(async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const registered_user = await User.register(newUser, password);
        console.log(registered_user);
        req.login(registered_user, (err) => {
            if(err){
                return next(err);
            }
            req.flash("success", "User registered successfully");
            res.redirect("/listings");
        })
    }
    catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
}));

router.get("/login", (req, res) => {
    res.render("users/login.ejs");
})

router.post("/login",
    saveRedirectUrl,
    passport.authenticate("local",
    { failureRedirect: "/login", failureFlash: true }),
    async (req, res) => {
        req.flash("success", "Logged in successfully");
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
})

router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if(err){
            return next(err);
        }
        req.flash("success", "Logged out successfully");
        res.redirect("/listings");
    })
})

module.exports = router;