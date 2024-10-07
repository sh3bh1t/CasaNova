const Review = require("../../CasaNova/models/review.js");
const Listing = require("../../CasaNova/models/listing.js");

// to add the particular listing related review to the DB
module.exports.addListingReview = async (req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author= req.user._id;

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Created !");
    res.redirect(`/listings/${listing._id}`);
};


//to delete a review from a listing

module.exports.deleteListingReview = async(req,res)=>{
    let {id,reviewId} = req.params;

    await Listing.findByIdAndUpdate(id ,{ $pull : { reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", " Review Deleted !");
    res.redirect(`/listings/${id}`);
 };
