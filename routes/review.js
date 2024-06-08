const express = require("express");
const router = express.Router({mergeParams: true});
const WrapAsync = require("../utils/wrapAsync.js");
const {validateReview, isLoggedIn,isReviewAuthor} = require("../middleware.js");
const reviewcontroller = require("../controllers/review.js");



  //reviews
//review post route
router.post("/",isLoggedIn, validateReview, WrapAsync(reviewcontroller.creatReview));
  
  // review delete route
  router.delete("/:reviewId",isLoggedIn,isReviewAuthor,WrapAsync(reviewcontroller.destroyReview));

  module.exports = router;