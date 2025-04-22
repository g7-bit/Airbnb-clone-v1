if(process.env.NODE_ENV != "production") {
  require('dotenv').config()
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const expressError = require("./utils/expressError.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js")

const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

app.engine("ejs", ejsMate);

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
async function main() {
  await mongoose.connect(MONGO_URL);
}

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });




const sessionOptions = {
secret: "mysuperranddomsecretcode",
resave: false,
saveUninitialized: true,
cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // when you want it to end on certain date

    //maxAge is mostly use for better UX
    maxAge: 7 * 24 * 60 * 60 * 1000, // when you want to relatively 7 days later

    httpOnly: true, //preventing cross Scripting attacks
},
};



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize()); //start using passport
app.use(passport.session());//enable persistant login session by passport


//authenticate() is by local-mongoose
passport.use(new LocalStrategy(User.authenticate()))// authenticate when user tries logging in


//When succesffully logged in...
//what to serialize(i.e store in session),   
// here serializeUser() (i.e userID is stored by pass-loc-mongoose)
passport.serializeUser(User.serializeUser());//to store user ID in session


//After subsequent logins 
//when req with valid data recieved, this fx is called
//takes userID and gets full user Object from the db
//attached to req.user
passport.deserializeUser(User.deserializeUser()); //retrieves full user obj from dbm, attaches it to req.user




app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user //for navbar.ejs

  next();
});

// app.get("/demouser", async(req,res)=>{
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "delta-student"
//     });

//     let registeredUser = await User.register(fakeUser, "helloworld");//also checks the if user exists
//     res.send(registeredUser)

// })



app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);



//for all OTHER routes, i.e unsuported routes.
app.all("*", (req, res, next) => {
  next(new expressError(404, "Page Not found!!!, app.all"));
});



app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something Went wrong" } = err;
  res.status(statusCode).render("error.ejs", { err });
  // res.status(statusCode).send(message)
});



app.listen(8080, () => {
  console.log("server is listeneing on port 8080");
});
