const express = require("express");
const router = express.Router();
const WrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const usercontroller = require("../controllers/user.js");

// signup
router.route("/signup")
.get(usercontroller.renderSignupForm)
.post( WrapAsync(usercontroller.signup));


//login

router.route("/login")
.get(usercontroller.renderLoginform)
.post(saveRedirectUrl,passport.authenticate("local",{failureRedirect: "/login",failureFlash: true}), usercontroller.login);



//logout
router.get("/logout",usercontroller.logout);

module.exports = router;