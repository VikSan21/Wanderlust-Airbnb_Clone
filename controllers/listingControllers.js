const Listing = require('../models/listing.js');

const index = async (req, res,next) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
};

const showListing = async (req, res, next) => {
    const {id} = req.params;
    const listing = await Listing.findById(id).populate({path : "reviews",populate : {path : "author"}}).populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
    }else{
        res.render("listings/show.ejs",{listing});   
    } 
};

const createListing = async(req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const listing = new Listing(req.body["listing"]);
    listing.owner = req.user._id;
    listing.image = {url, filename};
    await listing.save();
    req.flash("success","new listing created!");
    res.redirect("/listings");
};

const editListing = async(req,res,next) => {
    const {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,req.body.listing,{runValidators:true});

    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }
  
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
};

const deleteListing = (req,res) => {
    const {id} = req.params;
    Listing.findByIdAndDelete(id).then(() => {
        req.flash("success","Listing Deleted!");
        res.redirect("/listings");
    }).catch( () => {
        res.send("Can't delete due to some error");
    })
};

const randerNewListingForm = (req, res) => {
    res.render("listings/new.ejs");
};

const randerEditForm = async (req, res) => {
    const {id} = req.params;
    Listing.findById(id).then(listing => {
        if(!listing){
            req.flash("error","Listing you requested for does not exist!");
            res.redirect("/listings");
        }else{
            let imageURL;
            if(listing.image.url){
                imageURL = listing.image.url;
                imageURL = imageURL.replace("/upload","/upload/w_250");
            }
            res.render("listings/edit.ejs",{listing,imageURL});  
        }
    }).catch(err => {
        res.send(err.name);
    });
};

module.exports = {
    index, showListing, createListing, editListing, deleteListing, randerNewListingForm, randerEditForm
};