const express = require("express");
const router = express.Router();
const { checkAuth } = require("../middleware/check-auth");
const serverError = require("../utils/serverError");
const { unlink } = require("fs");
const {
  checkMeetupExistence,
} = require("../middleware/check-meetup-existence");
const {
  getMeetups,
  addMeetup,
  updateMeetup,
  deleteMeetup,
} = require("../database/meetup-query");
const { uploadImage } = require("../middleware/upload-image");

router.get("/", async (req, res, next) => {
  let meetups;
  try {
    meetups = await getMeetups();
  } catch (error) {
    return next(error);
  }

  res.json(meetups).status(200);

  // res.json().status(201)
});

router.post(
  "/",
  checkAuth,
  uploadImage.single("image"),
  async (req, res, next) => {
    const data = req.body;
    let meetup;
    let imageUrl = req.file ? req.file.path : "";

    try {
      meetup = await addMeetup({
        title: data.title,
        subtitle: data.subtitle,
        description: data.description,
        imageUrl: imageUrl,
        address: data.address,
        contactEmail: req.currentUser.email,
        createrId: req.currentUser.id,
        isFavorite: data.isFavorite === "true" ? true : false,
      });
    } catch (error) {
      return next(error);
    }
    res.json(meetup).status(201);
  }
);

router.put(
  "/:id",
  checkAuth,
  checkMeetupExistence,
  uploadImage.single("image"),
  async (req, res, next) => {
    const { id } = req.params;
    const data = req.body;
    let newData = data;

    if (data.image || data.image === "") {
      const { image, ...withoutImage } = data;
      newData = withoutImage;
    }

    if (data.isFavorite && typeof data.isFavorite === "string") {
      if (data.isFavorite === "true") {
        newData.isFavorite = true;
      } else {
        newData.isFavorite = false;
      }
    }
    if (req.file) {
      const oldImage = req.currentMeetup.imageUrl;
      unlink(oldImage, (e) => {
        console.log(e);
      });
      newData = { ...newData, imageUrl: req.file.path };
    }

    try {
      await updateMeetup(id, { ...newData, createrId: req.currentUser.id });
    } catch (error) {
      return next(error);
    }
    res.json({ message: "Updated Successfully" }).status(201);
  }
);

router.delete(
  "/:id",
  checkAuth,
  checkMeetupExistence,
  async (req, res, next) => {
    const { id } = req.params;
    try {
      await deleteMeetup(id);
    } catch (error) {
      return next(error);
    }
    const deletingImage = req.currentMeetup.imageUrl;
    unlink(deletingImage, (e) => console.log(e));
    res.json({ message: "Deleted Successfully" }).status(201);
  }
);

module.exports = router;
