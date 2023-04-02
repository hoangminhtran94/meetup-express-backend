const express = require("express");
const bcrypt = require("bcrypt");
const route = express.Router();
const { uploadImage } = require("../middleware/upload-image");
const jwt = require("jsonwebtoken");
const { createAUser } = require("../database/user-query");
const { checkUserExistence } = require("../middleware/check-user-existence");
const serverError = require("../utils/ServerError");
route.post("/login", checkUserExistence, async (req, res, next) => {
  const { password: rawPassword } = req.body;
  const user = req.user;
  //

  const passwordChecked = bcrypt.compareSync(rawPassword, user.password);
  if (!passwordChecked) {
    return next(serverError("Password is incorrect", 403));
  }

  const token = jwt.sign({ userId: user.id }, "thisismysecret");
  const { password, ...returnData } = user;
  res.json({ ...returnData, token }).status(201);
});

route.post(
  "/register",
  uploadImage("public/profile-images").single("image"),
  async (req, res, next) => {
    const { firstName, lastName, email, password: rawPassword } = req.body;
    let hashedPassword;
    try {
      hashedPassword = bcrypt.hashSync(rawPassword, 10);
    } catch (error) {
      next(error);
    }

    let user;
    try {
      user = await createAUser({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });
    } catch (error) {
      next(error);
    }
    const { password, ...returnData } = user;
    const token = jwt.sign({ userId: user.id }, "thisismysecret");
    res.json({ ...returnData, token }).status(201);
  }
);

module.exports = route;
