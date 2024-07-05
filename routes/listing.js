const express = require('express');
const listing_router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingControllers = require("../controllers/listingControllers.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

listing_router.route("/")
    .get(wrapAsync(listingControllers.index))
    .post(isLoggedIn,upload.single("listing[image]"),wrapAsync(listingControllers.createListing));


listing_router.get("/new",isLoggedIn, listingControllers.randerNewListingForm);

listing_router.route("/:id").get(wrapAsync(listingControllers.showListing))
    .put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingControllers.editListing))
    .delete(isLoggedIn,isOwner, listingControllers.deleteListing);


listing_router.get("/:id/edit",isLoggedIn,isOwner, listingControllers.randerEditForm);

module.exports = listing_router;