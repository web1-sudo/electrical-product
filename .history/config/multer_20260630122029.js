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

    } 

    else if (
  file.fieldname === "pdf" ||
  file.fieldname === "catalog_pdf" ||

  file.fieldname === "variant1_datasheet" ||
  file.fieldname === "variant1_catalog" ||
  file.fieldname === "variant1_installation" ||

  file.fieldname === "variant2_datasheet" ||
  file.fieldname === "variant2_catalog" ||
  file.fieldname === "variant2_installation" ||

  file.fieldname === "variant3_datasheet" ||
  file.fieldname === "variant3_catalog" ||
  file.fieldname === "variant3_installation" ||

  file.fieldname === "variant4_datasheet" ||
  file.fieldname === "variant4_catalog" ||
  file.fieldname === "variant4_installation"
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