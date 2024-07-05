const express = require('express');
const review_router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReviews, isLoggedIn,isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/reviewControllers.js");


// create(post) route
review_router.post("/",isLoggedIn,validateReviews, wrapAsync(reviewController.postReview));

//delete review route
review_router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview));


module.exports = review_router;