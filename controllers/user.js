const User = require("/models/user.js");

// route to signup form for user
module.exports.renderSignUpForm =(req, res) => {
    res.render("users/userSignup.ejs");
};


//route to save registered user in DB
module.exports.saveUserToDB =async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to CasaNova");
            return res.redirect("/listings");
        });
    }
    catch (err) {
        req.flash("error", err.message);
        return res.redirect("/signup");
    }
};


//route for user to login
module.exports.userLogin =(req, res) => {
    res.render("users/userLogin.ejs");
};


//route for user login authentication
module.exports.authenticateUserLogin = async (req, res) => {
    req.flash("success", "you are logged in");
    let redirectUrl = res.locals.redirectUrl || "/listings" ;
    return res.redirect(redirectUrl);
};


// route for user logout
module.exports.userLogout = (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are Logged Out!");
        return res.redirect("/listings");
    });
};
