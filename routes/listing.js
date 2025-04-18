const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })


const listingController = require("../controllers/listings.js");

router
  .route("/")
  .get(wrapAsync(listingController.index)) //INDEX ROUTE
  // .post(
  //   //Create Route
  //   isLoggedIn,
  //   validateListing,
  //   wrapAsync(listingController.createListing)
  // );

  .post(upload.single("listing[image]"), (req,res)=>{
    res.send(req.file)
  })


//Create new btn route
//ADDED before show route because "new" would be treated as :id
router.get("/new", isLoggedIn, listingController.renderNewForm);



router
  .route("/:id")

  //Show route
  .get(wrapAsync(listingController.showListing))

  .put(
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  //DELETE ROUTE
  .delete(
    isLoggedIn,
    isOwner,
  );



// Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;
