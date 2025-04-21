const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const multer  = require('multer')
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage })//dest: 'storage' i.e cloudinary 


const listingController = require("../controllers/listings.js");

router
  .route("/")
  .get(wrapAsync(listingController.index)) //INDEX ROUTE
  .post(
    //Create Route
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
  )

1

//Create new btn route
//ADDED before show route because "new" would be treated as :id
router.get("/new", isLoggedIn, listingController.renderNewForm);



router
  .route("/:id")

  //Show route
  .get(wrapAsync(listingController.showListing))

  //UPDATE route
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    // validateListing,  //to be changed to accomodate changes in model schema
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
