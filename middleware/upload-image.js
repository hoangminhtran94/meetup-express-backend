const multer = require("multer");
const { v4 } = require("uuid");
const serverError = require("../utils/ServerError");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
  "image/avif": "avif",
};
exports.uploadImage = multer({
  limits: 50000000,
  storage: multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, "public/images");
    },
    filename: (req, file, callback) => {
      const fileName = v4() + "." + MIME_TYPE_MAP[file.mimetype];
      callback(null, fileName);
    },
  }),
  fileFilter: (req, file, callback) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    const error = isValid
      ? null
      : serverError("File type is not supported", 403);
    callback(error, isValid);
  },
});
