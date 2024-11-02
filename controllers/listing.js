const Listing = require("../models/listing.js");
const forwardGeocode = require("../utils/geocode.js");


//to show all listings
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};


//to add a new listing
module.exports.renderNewFrom = (req, res) => {
    res.render("listings/new.ejs");
};


//to add the new listing to database
module.exports.saveNewToDB = async (req, res, next) => {

    const address = req.body.listing.location;
    const geocodeResult = await forwardGeocode(address);
    console.log(geocodeResult.items[0].position);

    if (geocodeResult && geocodeResult.items && geocodeResult.items.length > 0) {
        const address = geocodeResult.items[0].position;



        let url = req.file.path;
        let filename = req.file.filename;
        let newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = { url, filename };
        newListing.coordinates = [address.lat ,address.lng]  ;
        //console.log(newListing.coordinates); 
        
        let savedListing =await newListing.save();
        console.log(savedListing);
        req.flash("success", "New Listing Added !");
        return res.redirect("/listings");

    }
};


    //to delete a listing
    module.exports.deleteListing = async (req, res) => {
        let { id } = req.params;
        let deletedListing = await Listing.findByIdAndDelete(id);
        console.log(deletedListing);
        req.flash("success", " Listing Deleted!");
        return res.redirect("/listings");
    };


    //to show a listing in detail
    module.exports.showInDetail = async (req, res) => {
        let { id } = req.params;
        let listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
        if (!listing) {
            req.flash("error", "Listing Does NOT Exist !");
            return res.redirect("/listings");
        }
        console.log(listing);
        res.render("listings/showindetail.ejs", { listing });
    };


    //to edit a listing
    module.exports.editListing = async (req, res) => {
        let { id } = req.params;
        let listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error", "Listing Does NOT Exist !");
            return res.redirect("/listings");
        }
        res.render("listings/edit.ejs", { listing });
    };


    //to save the edited changes into DB
    module.exports.saveEditToDB = async (req, res) => {
        let { id } = req.params;
        let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

        if (typeof req.file !== "undefined") {
            let url = req.file.path;
            let filename = req.file.filename;
            listing.image = { url, filename };
            await listing.save();
        }

        req.flash(" success", "Listing Updated !");
        return res.redirect("/listings");
    };
