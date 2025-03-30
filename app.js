const express= require("express");
const app = express();
const mongoose = require("mongoose")
const Listing = require("./models/listing.js")
const path = require("path")
const methodOverride= require("method-override")
const ejsMate = require("ejs-mate");
const wrapAsync= require("./utils/wrapAsync.js")
const expressError= require("./utils/expressError.js")
const {listingSchema} = require("./schema.js")  //use {destructuring when want to only import specific required}


app.set("view engine", "ejs")
app.set("views", path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"))
app.use(express.static(path.join(__dirname,"/public")))

app.engine('ejs', ejsMate)

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
async function main() {
    await mongoose.connect(MONGO_URL);
    
}

main()
.then(()=>{
    console.log("connected to DB")
})
.catch((err)=>{
    console.log(err)
})





app.get("/", (req,res)=>{
    res.send("Home route working")
})

//joi schema validation 
const validateListing= (req,res,next)=>{
    let {error} = listingSchema.validate(req.body)
    if (error){

        let errorMsg= error.details.map( (el)=> el.message).join(",")
        
        throw new expressError(404,errorMsg)
    }else{
        next();
    }
}

//INDEX route
app.get("/listings", wrapAsync(async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings})

})
)

//Create new btn route   
//ADDED before show route because "new" would be treated as :id 
app.get("/listings/new", (req,res)=>{
    res.render("listings/new.ejs")
    
})


//Show route
app.get("/listings/:id", wrapAsync(async (req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id)
    res.render("listings/show.ejs", {listing})

})
)




//Create Route

//validateListing is a middleware here
app.post("/listings",validateListing, wrapAsync(async (req,res,next)=>{
    



    const newListing= new Listing(req.body.listing);
    await newListing.save()
    
    res.redirect("/listings");
    })
)

app.get("/listings/:id/edit", async (req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id)

    res.render("listings/edit.ejs",{listing})

})

// Update Route
app.put("/listings/:id", validateListing, wrapAsync(async(req,res)=>{

    let {id}= req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});

    res.redirect(`/listings/${id}`)
})
);

//DELETE ROUTE
app.delete("/listings/:id", wrapAsync(async (req,res)=>{
    let {id}= req.params;
    // console.log(id)
    let deletedListing= await Listing.findByIdAndDelete(id);
    console.log(deletedListing)
    res.redirect("/listings")
})
)
 

//for all OTHER routes, i.e unsuported routes.
app.all("*", (req,res,next)=> {
    next(new expressError(404,"Page Not found!!!, app.all"))
});


app.use((err, req,res,next)=>{
    let {statusCode = 500, message="Something Went wrong"}= err;
    res.status(statusCode).render("error.ejs", {err})
    // res.status(statusCode).send(message)
})


app.listen(8080, ()=>{
    console.log("server is listeneing on port 8080")
})