 const express=require("express");
 const router = express.Router({mergeParams : true});
 const WrapAsync = require("/utils/WrapAsync.js");
 const ExpressError = require("/utils/ExpressError.js");
 const {listingSchemaValidation, reviewSchemaValidation} = require("/schemavalidation.js");
 const Review = require("/models/review.js");
 const Listing = require("/models/listing.js");
const { addListingReview, deleteListingReview } = require("/controllers/review.js");
 
 // REVIEWS PART

//to validate reviews for a listing while adding new or updating one
const validateReview= (req,res,next)=>{
    let {error} = reviewSchemaValidation.validate(req.body);
    if(error){
        let errorMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(404,errorMsg);
    }else{
        next();
    }
}

// to add the particular listing related review to the DB
router.post("/", validateReview , WrapAsync(addListingReview));

//to delete a review from a listing
router.delete("/:reviewId",  WrapAsync(deleteListingReview));

 module.exports = router;
