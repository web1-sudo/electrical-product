const express = require("express");

const router = express.Router();

const { homePage, singleProduct } = require("../controllers/productController");

// PRODUCTS PAGE

router.get("/products", homePage);

// SINGLE PRODUCT

router.get("/product/:slug", singleProduct);


res.render("single-product", {
  product,
  relatedProducts,
});

module.exports = router;
