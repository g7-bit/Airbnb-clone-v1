const express= require("express");
const app = express();
const mongoose = require("mongoose")
const path = require("path")
const methodOverride= require("method-override")
const ejsMate = require("ejs-mate");
const expressError= require("./utils/expressError.js")

const listings = require("./routes/listing.js")
const reviews = require("./routes/review.js")


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

app.use("/listings", listings)
app.use("/listings/:id", reviews)





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