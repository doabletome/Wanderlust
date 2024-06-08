const express = require("express");
const router = express.Router();
const WrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage});



// index and create
router.route("/")
   .get(WrapAsync(listingController.index))
   .post(isLoggedIn, upload.single('listing[image]'),validateListing,WrapAsync(listingController.createListing ));
   


//New Route , new route should be above "/:id" route, if not then new will be interpreted as an id
  router.get("/new",isLoggedIn,listingController.renderNewForm );


 //Show Route //Update Route  //Delete Route
router.route("/:id")
   .get( WrapAsync(listingController.showListing))
   .put(isLoggedIn,isOwner,upload.single('listing[image]'), validateListing,WrapAsync(listingController.updateListing))
   .delete(isLoggedIn,isOwner, WrapAsync(listingController.destroyListing));
  

  
  //Edit Route
  router.get("/:id/edit" ,isLoggedIn,isOwner, WrapAsync(listingController.renderEditForm));
  

  
  module.exports = router;