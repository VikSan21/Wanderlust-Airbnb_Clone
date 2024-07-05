require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require("path");
const app = express();
const methodoverride = require("method-override");
const ejs_mate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listing_router = require("./routes/listing.js");
const review_router = require("./routes/review.js");
const user_router = require("./routes/user.js");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const MongoStore = require('connect-mongo');

const DB_URL = process.env.ATLASDB_URL;

//call the main() to connect with mongo
main().then( () => {
    console.log("connected successfully");
}).catch( err => {
    console.log(err);
});

//function to connect mongodb
async function main(){
    await mongoose.connect(DB_URL);
}

//basic middleware
app.use(express.urlencoded({extended: true}));
app.use(methodoverride("_method"));
app.use(express.json());
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.engine('ejs',ejs_mate);
app.use(express.static(path.join(__dirname,"static_files/styles")));
app.use(express.static(path.join(__dirname,"static_files/scripts")));
app.use(cookieParser("$21112004vik$san"));

const store = MongoStore.create({
    mongoUrl: DB_URL,
    crypto: {
        secret: process.env.SECRET,
      },
      touchAfter : 24 * 3600,
});

store.on("error" , () => {
    console.log("Error in mongo session");
});

const sessionOptions = {
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 + 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true
    }
};


//root route
app.get("/", (req, res) => {
    
    res.redirect("/listings")
});


app.use(session(sessionOptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});


//user router
app.use("/", user_router);

//listing router
app.use("/listings",listing_router);

//review router
app.use("/listings/:id/reviews",review_router);


app.use("*",(req,res, next) => {
    next(new ExpressError(404,"Page not Found"));
});

app.use( (err, req, res, next) => {
    console.log(req.method,req.path);
    let {statusCode = 500, message} = err;
    res.status(statusCode).send(message);
});

//listening function
app.listen(8080, () => {
    console.log("Requests are being listen on port 8080");
});