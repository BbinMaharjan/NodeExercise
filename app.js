const express = require("express");
const app = express();
const morgan = require("morgan");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");

// Passport Config
require("./config/passport")(passport);

// db config
const db = require("./config/key").mongoURI;

// connect to mongo
mongoose
  .connect(db, { useNewUrlParser: true })
  .then((result) => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

// middlewares
app.use(express.static("public"));
app.use(morgan("dev"));

// ejs
app.use(expressLayouts);
app.set("view engine", "ejs");

// bodyparser
app.use(express.urlencoded({ extended: false }));

// Express session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));

const PORT = process.env.PORT || 8080;

app.listen(
  PORT,
  console.log(`Server startred on port http://localhost:${PORT} `)
);
