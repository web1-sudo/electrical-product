const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({

  destination: function (req, file, cb) {

    if (
      file.fieldname === "image" ||
      file.fieldname === "image2" ||
      file.fieldname === "image3"
    ) {

      cb(null, "public/images");

    } else if (
      file.fieldname === "pdf" ||
      file.fieldname === "catalog_pdf"
    ) {

      cb(null, "public/pdf");

    }

  },

  filename: function (req, file, cb) {

    cb(
      null,
      Date.now() + path.extname(file.originalname)
    );

  }

});

module.exports = multer({ storage });