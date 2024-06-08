
if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");



const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


const dburl = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dburl);
}



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));
app.engine("ejs",ejsmate);

const store = MongoStore.create({
  mongoUrl: dburl,
  crypto:{
    secret: process.env.SECRET,
  },
  touchAfter: 24*3600,
})

store.on("error",()=>{
  console.log("error in mongo session store", err);
});


const sessionOptions = {
  store: store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized  : true,

  cookie:{
    //expire date od our session
    expires: Date.now() +7*24*60*60*1000,
    maxAge: 7*24*60*60*1000,
    httpOnly: true,
  },
};


app.use(session(sessionOptions));
app.use(flash());

//passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// middle ware for flash
app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});


//demo user
app.get("/demouser", async(req,res)=>{
  let fakeUser = new User({
    email:"student@gmail.com",
    username:"delta-student",
  });
  let registereduser = await User.register(fakeUser,"helloword");
  res.send(registereduser);
});


app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

// app.get("/", (req, res) => {
//   res.send("Hi, I am root");
// });




app.all("*",(req,res,next)=>{
  next(new ExpressError(500,"page not found"));
})

app.use((err,req,res,next)=>{
  let {statusCode = 500, message="something went wrong"} = err;
  res.render("./listings/error.ejs",{message});
  // res.status(statusCode).send(message);
})



app.listen(8080, () => {
  console.log("server is listening to port 8080");
});