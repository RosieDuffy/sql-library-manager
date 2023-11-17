var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var booksRouter = require("./routes/books");

const { sequelize } = require("./models");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/books", booksRouter);

// testing connection
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database: ", error);
  });

sequelize
  .sync()
  .then(() => {
    console.log("Book table created successfully!");
  })
  .catch((error) => {
    console.error("Unable to create table : ", error);
  });

// catch 404, display message and render 'page-not-found' view
app.use((req, res, next) => {
  const err = new Error("Page not found");
  err.status = 404;
  err.message = "Sorry, the page you are looking for cannot be found";
  console.log(err);
  res.render("page-not-found", { err });
});

// error handler
app.use((err, req, res, next) => {
  if (err.message && err.status) {
    console.log(err);
    res.render("error", { err });
  } else {
    err.message = "Sorry, something went wrong :/";
    err.status = 500;
    console.log(err);
    res.render("error", { err });
  }
});

module.exports = app;
