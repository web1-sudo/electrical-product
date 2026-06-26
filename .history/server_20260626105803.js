const express = require("express");
const path = require("path");
const session = require("express-session");
require("dotenv").config();

const app = express();

// DATABASE
require("./config/db");

// =====================
// MIDDLEWARE
// =====================

// Parse Form Data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "mysecretkey",
    resave: false,
    saveUninitialized: false,
  })
);


app.use((req, res, next) => {
    res.locals.currentPath = req.path;
    next();
});

// Static Files
app.use(express.static(path.join(__dirname, "public")));

// View Engine
app.set("view engine", "ejs");

// Debug Request Logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log("BODY:", req.body);
  next();
});

// =====================
// ROUTES
// =====================

const pageRoutes = require("./routes/pageRoutes");
const productRoutes = require("./routes/productRoutes");
const contactRoutes = require("./routes/contactRoutes");
const supportRoutes = require("./routes/supportRoutes");
const careerRoutes = require("./routes/careerRoutes");
const homeRoutes = require("./routes/homeRoutes");
const modelRoutes = require("./routes/modelRoutes");
const sitemapRoutes = require("./routes/sitemapRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Page Routes
app.use("/", pageRoutes);

// Home Routes
app.use("/", homeRoutes);

// Product Routes
app.use("/", productRoutes);

// Contact Routes
app.use("/", contactRoutes);

// Support Routes
app.use("/", supportRoutes);

// Career Routes
app.use("/", careerRoutes);

// Home Routes
app.use("/", homeRoutes);

// Model Routes
app.use("/", modelRoutes);

// Sitemap Routes
app.use("/", sitemapRoutes);

// Admin Routes
app.use("/admin", adminRoutes);

// Test Route
app.get("/test", (req, res) => {
  res.send("Server Working");
});

// =====================
// SERVER
// =====================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server Running On Port ${PORT}`);
});