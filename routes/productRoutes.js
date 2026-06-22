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

router.get(
  "/products",
  homePage
);

// CATEGORY PAGE

router.get(
  "/products/:category",
  categoryListing
);

// BRAND PAGE

router.get(
  "/products/:category/:brand",
  brandListing
);

// SUBCATEGORY PAGE

router.get(
  "/products/:category/:brand/:subcategory",
  subcategoryListing
);

// SINGLE PRODUCT PAGE

router.get(
  "/product/:slug",
  singleProduct
);

module.exports = router;