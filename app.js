const createError = require("http-errors");
const express = require("express");
const path = require("path");
const fs = require("fs");
const { corsHandler } = require("./middleware/corsHandler");
const meetupRouter = require("./routes/meetup");
const db = require("./database/script");
const app = express();

// view engine setup
// app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(corsHandler);
app.use("/public/images", express.static(path.join("public", "images")));
app.use("/api/meetups", meetupRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});
// error handler
app.use(function (err, req, res, next) {
  if (req.file) {
    fs.unlink(req.file.path, (e) => {
      console.log(e);
    });
  }
  console.log(err);
  res.status(err.status || 500).json({ error: err });
});
db.$connect().then(() => {
  app.listen(5000);
});
