const express = require("express");

const router = express.Router();

// HOME

router.get("/", (req, res) => {
  res.render("index");
});

// ABOUT

router.get("/about", (req, res) => {
  res.render("about");
});

// CONTACT PAGE

router.get("/contact-page", (req, res) => {
  res.render("contact");
});

module.exports = router;
