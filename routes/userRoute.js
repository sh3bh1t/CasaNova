const express = require("express");
const router = express.Router({});
const User = require("../models/user.js");
const WrapAsync = require("../utils/WrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");



// route to signup form for user
router.get("/signup", userController.renderSignUpForm);


//route to save registered user in DB
router.post("/signup", WrapAsync(userController.saveUserToDB));


//route for user to login
router.get("/login", userController.userLogin);

//route for user login authentication
router.post("/login", saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), userController.authenticateUserLogin);



// route for user logout
router.get("/logout", userController.userLogout);
 


module.exports = router;
