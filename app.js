if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js")


const listingsRouter = require("./routes/listingRoute.js");
const reviewsRouter = require("./routes/reviewRoute.js");
const usersRouter = require("./routes/userRoute.js");

const port = 3030;
const dbURL= process.env.ATLASDB_URL ;

main().then(() => {
    console.log("connected to DB");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(dbURL);
}


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


const sessionOptions = {
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 10 * 24 * 60 * 60 * 1000,
        maxAge: 10 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

const store = MongoStore.create({
    mongoUrl : dbURL,
    crypto : {
        secret :  process.env.SECRET,
    },
    touchAfter : 7 * 24 * 3600 ,
})

store


app.use(session(sessionOptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware to store the flash messages in session locals
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});


app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", usersRouter);



//custom error in case a page is not found
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found !")); //this error will be thrown and caught by the middleware defined next to catch async errors
});

//middleware to catch async errors
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something Went Wrong" } = err;
    res.status(statusCode).render("listings/error.ejs", { message });
    //res.status(statusCode).send(message);
    //res.send("something is wrong")
});

app.listen(port, () => {
    console.log(`server is listening to port ${port}`);
});

