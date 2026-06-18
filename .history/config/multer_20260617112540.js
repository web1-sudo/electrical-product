const multer = require("multer");

const path = require("path");

// STORAGE

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "image") {
      cb(null, "public/images");
    } else {
      cb(null, "public/pdf");
    }
  },

  filename: function (req, file, cb) {
    cb(
      null,

      Date.now() + path.extname(file.originalname),
    );
  },
});

const upload = multer({
  storage: storage,
});

module.exports = upload;
