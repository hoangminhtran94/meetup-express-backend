const createError = require("http-errors");
const express = require("express");
const path = require("path");
const fs = require("fs");
const { corsHandler } = require("./middleware/corsHandler");
const meetupRouter = require("./routes/meetup");
const authRouter = require("./routes/auth");
const db = require("./database/script");
const app = express();
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");

// view engine setup
// app.use(bodyParser.json());
app.use(corsHandler);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(
//   cookieSession({
//     name: "session",
//     keys: ["mysecretcookie"],
//     secure: false,
//     sameSite: "lax",
//     maxAge: 30 * 24 * 60 * 60,
//     httpOnly: true,
//   })
// );

app.use("/public/images", express.static(path.join("public", "images")));
app.use("/api/auth", authRouter);
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
  res
    .status(err.status || 500)
    .json({ error: err.message ?? "Something wrong happened" });
});

db.$connect().then(() => {
  app.listen(5000);
});
