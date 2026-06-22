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

// SINGLE PRODUCT PAGE

router.get("/single-product", (req, res) => {
  res.render("single-product");
});

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





