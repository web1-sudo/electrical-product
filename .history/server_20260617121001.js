const express = require("express");
const path = require("path");

const contactRoutes = require("./routes/contactRoutes");
const supportRoutes = require("./routes/supportRoutes");
const careerRoutes = require("./routes/careerRoutes");
const homeRoutes = require("./routes/homeRoutes");
const modelRoutes = require("./routes/modelRoutes");

const sitemapRoutes = require("./routes/sitemapRoutes");

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

const express = require("express");
const path = require("path");

app.set("view engine", "ejs");

app.use(express.static("public"));

app.listen(3000, () => {
  console.log("Server Running");
});
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

// support form
app.use("/", supportRoutes);

// Career form
app.use("/", careerRoutes);

// home form
app.use("/", homeRoutes);

// model form
app.use("/", modelRoutes);

// Site map

app.use("/", sitemapRoutes);

// SERVERconst express = require("express");
const path = require("path");

const contactRoutes = require("./routes/contactRoutes");
const supportRoutes = require("./routes/supportRoutes");
const careerRoutes = require("./routes/careerRoutes");
const homeRoutes = require("./routes/homeRoutes");
const modelRoutes = require("./routes/modelRoutes");

const sitemapRoutes = require("./routes/sitemapRoutes");

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

// support form
app.use("/", supportRoutes);

// Career form
app.use("/", careerRoutes);

// home form
app.use("/", homeRoutes);

// model form
app.use("/", modelRoutes);

// Site map

app.use("/", sitemapRoutes);

// SERVER

const adminRoutes = require("./routes/adminRoutes");

app.use("/admin", adminRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server Running On ${PORT}`);
});

const adminRoutes = require("./routes/adminRoutes");

app.use("/admin", adminRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server Running On ${PORT}`);
});
