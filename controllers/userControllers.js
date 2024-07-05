const User = require("../models/user.js");

const signup = async (req, res) => {
    try{
        const {username, email, password} = req.body;
        const newUser = new User({username, email});
        const registeredUser = await User.register(newUser,password);
        req.login(registeredUser,(err) => {
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to WanderLust!");
            res.redirect("/listings");
        });
    } catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
};

const login = async (req, res) => {
    req.flash("success","Welcome back to WanderLust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};


const logout = (req, res, next) => {
    req.logout((err) => {
        if (err){
            return next(err);
        }
    });
    req.flash("success","logout successfully!");
    res.redirect("/listings");
};

const loginForm = (req,res) => {
    res.render("users/login.ejs");
};

const signupForm = (req, res) => {
    res.render("users/signup.ejs");
};


module.exports = {
    login,signup,logout,signupForm,loginForm
};