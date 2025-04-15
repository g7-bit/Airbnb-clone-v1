const express = require("express")
const router = express.Router()
const wrapAsync= require("../utils/wrapAsync.js")
const expressError= require("../utils/expressError.js")
const {listingSchema,reviewSchema} = require("../schema.js")  //use {destructuring when want to only import specific required}
const Listing = require("../models/listing.js")



//joi schema validation 
const validateListing= (req,res,next)=>{
    console.log(req.body)
    let {error} = listingSchema.validate(req.body)
    console.log(error)
    if (error){

        let errorMsg= error.details.map( (el)=> el.message).join(",")
        
        throw new expressError(404,errorMsg)
    }else{
        next();
    }
}

//INDEX route
router.get("/", wrapAsync(async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings})

})
)

//Create new btn route   
//ADDED before show route because "new" would be treated as :id 
router.get("/new", (req,res)=>{
    res.render("listings/new.ejs")
    
})


//Show route
router.get("/:id", wrapAsync(async (req,res)=>{
    let {id}= req.params;

    //using populate to send full review and NOT JUST OBJECT_id
    const listing = await Listing.findById(id).populate("reviews");

    if(!listing) {
        req.flash("error", "Requested Listing does not exists");

        return res.redirect("/listings")
    }

    res.render("listings/show.ejs", {listing})

})
)




//Create Route

//validateListing is a middleware here
router.post("/",validateListing, wrapAsync(async (req,res,next)=>{
    

    const newListing= new Listing(req.body.listing);
    await newListing.save()

    req.flash("success", "New Listing Created");
    
    res.redirect("/listings");
    })
)

// Edit Route

router.get("/:id/edit", wrapAsync(async (req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id)

   
    if(!listing) {
        req.flash("error", "Requested Listing does not exists");

        return res.redirect("/listings")
    } 

    res.render("listings/edit.ejs",{listing})

})
);


// Update Route
router.put("/:id", validateListing, wrapAsync(async(req,res)=>{

    let {id}= req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});

    req.flash("success", "Listing Updated!");


    res.redirect(`/listings/${id}`)
})
);

//DELETE ROUTE
router.delete("/:id", wrapAsync(async (req,res)=>{
    let {id}= req.params;
    // console.log(id)
    let deletedListing= await Listing.findByIdAndDelete(id);

    req.flash("success", "Listing Deleted!");
 

    console.log(deletedListing)
    res.redirect("/listings")
})
)

module.exports = router;