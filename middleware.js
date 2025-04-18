const Listing = require("./models/listing.js")
const Review = require("./models/review.js")
const expressError= require("./utils/expressError.js")
const {listingSchema,reviewSchema} = require("./schema.js")  //use {destructuring when want to only import specific required}


module.exports.isLoggedIn = (req,res,next)=>{
    


    // console.log(req.path, `req.originalUrl: `, req.originalUrl)


    if(!req.isAuthenticated()){
        //
        req.session.redirectUrl = req.originalUrl

        req.flash("error", "you must be logged in to create listing");
        return res.redirect('/login')
    }
    next();
}

module.exports.savedRedirectUrl = (req,res,next)=>{

    //since passport resets req.session    ...
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }

    next()
}


module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params;
    let listing= await Listing.findById(id);

    if(!listing.owner[0].equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner of this post");

        return res.redirect(`/listings/${id}`);
    }

    next()
}

//joi schema validation 
module.exports.validateListing= (req,res,next)=>{
   
    let {error} = listingSchema.validate(req.body)
    console.log(error)
    if (error){

        let errorMsg= error.details.map( (el)=> el.message).join(",")
        
        throw new expressError(404,errorMsg)
    }else{
        next();
    }
}

//joi review validation 
module.exports.validateReview= (req,res,next)=>{
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


module.exports.isReviewAuthor = async (req, res, next) => {
    let {id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};