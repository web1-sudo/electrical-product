const contactRoutes = require("./routes/contactRoutes");
const express = require("express");

const sitemapRoutes = require("./routes/sitemapRoutes");

const path = require("path");

const bodyParser = require("body-parser");

const session = require("express-session");

require("dotenv").config();

const app = express();

// DATABASE

require("./config/db");

// ROUTES

const productRoutes = require("./routes/productRoutes");

// VIEW ENGINE

app.set("view engine", "ejs");

// BODY PARSER

app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.use(bodyParser.json());

// SESSION

app.use(
  session({
    secret: process.env.SESSION_SECRET,

    resave: false,

    saveUninitialized: true,
  }),
);

// STATIC FILES

app.use(express.static(path.join(__dirname, "public")));

// ROUTES

// Product

app.use("/", productRoutes);

//contact

app.use("/", contactRoutes);

// Site map

app.use("/", sitemapRoutes);

// SERVER

const adminRoutes = require("./routes/adminRoutes");

app.use("/admin", adminRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server Running On ${PORT}`);
});
