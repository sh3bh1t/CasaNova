const express = require("express");
const router = express.Router();
const WrapAsync = require("/utils/WrapAsync.js");
const ExpressError = require("/utils/ExpressError.js");
const Listing = require("/models/listing.js");
const { listingSchemaValidation, reviewSchemaValidation } = require("/schemavalidation.js");
const { isLoggedIn } = require("/middleware.js");
const listingController = require("/controllers/listing.js");
const multer  = require('multer')
const {storage}= require("/cloudConfig.js");
const upload = multer({ storage });
//const fetch = require('node-fetch');


// LISTINGS PART 

//to validate listings while adding new or updating one
const validateListing = (req, res, next) => {
    let { error } = listingSchemaValidation.validate(req.body);
    if (error) {
        let errorMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(404, errorMsg);
    } else {
        next();
    }
}


//to show all listings
router.get("/", WrapAsync(listingController.index));


//to add a new listing
router.get("/new", isLoggedIn, listingController.renderNewFrom);

//to add the new listing to database
router.post("/", isLoggedIn, upload.single("listing[image]"), validateListing,  WrapAsync(listingController.saveNewToDB));



//to delete a listing
router.delete("/:id", isLoggedIn, WrapAsync(listingController.deleteListing));

//to show a listing in detail
router.get("/:id", WrapAsync(listingController.showInDetail));

//to edit a listing
router.get("/:id/edit", isLoggedIn, WrapAsync(listingController.editListing));

//to save the edited changes into DB
router.put("/:id", isLoggedIn, upload.single("listing[image]"), validateListing, WrapAsync(listingController.saveEditToDB));

module.exports = router;
