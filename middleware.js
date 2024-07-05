const Listing = require("./models/listing.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");


module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","you must be logged in!");
        return res.redirect("/login");
    }

    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
        console.log(res.locals.redirectUrl);
    }
    next();
};

module.exports.isOwner = async  (req, res, next) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","Permission Denied!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};


module.exports.validateListing = (req, res, next) => {
    const {error} = listingSchema.validate(req.body);
    if(error){
        console.log(error);
        throw new ExpressError(400, error.message);
    }
    else{
        next();
    }
};

module.exports.validateReviews = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error){
        console.log(error);
        throw new ExpressError(400, error.message);
    }
    else{
        next();
    }
};

module.exports.isReviewAuthor = async  (req, res, next) => {
    const {id,reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error","Permission Denied for Review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};