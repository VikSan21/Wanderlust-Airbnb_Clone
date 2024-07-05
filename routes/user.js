const express = require('express');
const user_router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');
const userController = require("../controllers/userControllers.js");


user_router.route("/signup").get(userController.signupForm).post(wrapAsync(userController.signup));
user_router.route("/login").get(userController.loginForm).post(saveRedirectUrl,
    passport.authenticate("local",{
        failureRedirect : "/login", 
        failureFlash: true}
    ),
    userController.login
);

user_router.get("/logout", userController.logout);

module.exports = user_router;