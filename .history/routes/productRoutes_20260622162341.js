const express = require("express");

const router = express.Router();

const {
  homePage,
  singleProduct,
  categoryListing,
} = require("../controllers/productController");

// PRODUCTS PAGE

router.get("/products", homePage);

// SINGLE PRODUCT PAGE

router.get("/single-product", (req, res) => {
  res.render("single-product");
});

// DYNAMIC PRODUCT PAGE

router.get("/product/:slug", singleProduct);

module.exports = router;



const {
  homePage,
  singleProduct,
  categoryListing
} = require("../controllers/productController");

router.get(
  "/products/:category",
  categoryListing
);