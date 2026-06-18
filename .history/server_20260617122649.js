const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");

require("dotenv").config();

const app = express();

// DATABASE

require("./config/db");

// ROUTES

const productRoutes = require("./routes/productRoutes");
const contactRoutes = require("./routes/contactRoutes");
const supportRoutes = require("./routes/supportRoutes");
const careerRoutes = require("./routes/careerRoutes");
const homeRoutes = require("./routes/homeRoutes");
const modelRoutes = require("./routes/modelRoutes");
const sitemapRoutes = require("./routes/sitemapRoutes");
const adminRoutes = require("./routes/adminRoutes");
const pageRoutes = require("./routes/pageRoutes");

// VIEW ENGINE

app.set("view engine", "ejs");

// BODY PARSER

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// SESSION

app.use(
  session({
    secret: process.env.SESSION_SECRET || "mysecretkey",
    resave: false,
    saveUninitialized: true,
  }),
);

// STATIC FILES

app.use(express.static(path.join(__dirname, "public")));

// PAGE ROUTES

app.use("/", pageRoutes);

// PRODUCT ROUTES

app.use("/", productRoutes);

// CONTACT ROUTES

app.use("/", contactRoutes);

// SUPPORT ROUTES

app.use("/", supportRoutes);

// CAREER ROUTES

app.use("/", careerRoutes);

// HOME ROUTES

app.use("/", homeRoutes);

// MODEL ROUTES

app.use("/", modelRoutes);

// SITEMAP

app.use("/", sitemapRoutes);

// ADMIN PANEL

app.use("/admin", adminRoutes);

// SERVER

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server Running On Port ${PORT}`);
});
