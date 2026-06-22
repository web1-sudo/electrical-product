const express = require("express");

const router = express.Router();

const {
  homePage,
  singleProduct,
  categoryListing,
  brandListing,
  subcategoryListing,
} = require("../controllers/productController");

// PRODUCTS PAGE

router.get("/products", homePage);



// DYNAMIC PRODUCT PAGE

router.get("/product/:slug", singleProduct);



router.get(
  "/products/:category",
  categoryListing
);


router.get(
  "/products/:category/:brand",
  brandListing
);


router.get(
  "/products/:category/:brand/:subcategory",
  subcategoryListing
);

module.exports = router;





