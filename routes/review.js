const express = require("express");
// const { route } = require("./listing");
const router = express.Router({mergeParams:true});

const wrapAsync= require("../utils/wrapAsync.js")
const expressError= require("../utils/expressError.js")
const {reviewSchema} = require("../schema.js")  //use {destructuring when want to only import specific required}
const Review = require("../models/review.js");
const Listing = require("../models/listing.js")




//joi review validation 
const validateReview= (req,res,next)=>{
    // console.log(req.body,`validateReveiw middleware`)

    //idk the given code was not throwing error when empty review was sent
    if(!req.body.review){
        throw new expressError(404,"empty review") 
    }

    let { error } = reviewSchema.validate(req.body)
    
    if (error) {

        let errorMsg= error.details.map( (el)=> el.message).join(",")
        
        throw new expressError(404,errorMsg)
    }else{
        next();
    }
}



//Reviews
//POst review Route 
router.post("/reviews",validateReview,wrapAsync(async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review)

    listing.reviews.push(newReview);
    
    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${req.params.id}`)
})
)

//Post delete Route
router.delete("/reviews/:reviewId",wrapAsync(async (req,res)=>{
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId)

    res.redirect(`/listings/${id}`)
})
) 

module.exports = router;