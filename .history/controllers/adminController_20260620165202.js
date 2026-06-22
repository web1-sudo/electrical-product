const Product = require("../models/productModel");
const slugify = require("slugify");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const db = require("../config/db");

// LOGIN PAGE

exports.loginPage = (req, res) => {
  console.log("LOGIN PAGE OPENED");
  res.render("admin/login");
};

// LOGIN

exports.login = (req, res) => {
  console.log("LOGIN FORM SUBMITTED");
  console.log("BODY:", req.body);

  if (!req.body || Object.keys(req.body).length === 0) {
    return res.send("No form data received");
  }

  const { email, password } = req.body;

  User.findUserByEmail(email, async (err, results) => {
    if (err) {
      console.log("DB ERROR:", err);
      return res.send("Database Error");
    }

    if (results.length === 0) {
      return res.send("User Not Found");
    }

    const user = results[0];

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.send("Invalid Password");
    }

    req.session.user = user;

    return res.redirect("/admin/dashboard");
  });
};

// DASHBOARD

// DASHBOARD

exports.dashboard = (req, res) => {
  db.query(
    "SELECT * FROM products ORDER BY id DESC",
    (err, results) => {
      if (err) {
        console.log(err);
        return res.send("Database Error");
      }

      res.render("admin/dashboard", {
        products: results,
      });
    }
  );
};


exports.productsPage = (req, res) => {
  db.query(
    "SELECT * FROM products ORDER BY id DESC",
    (err, results) => {

      if (err) {
        console.log(err);
        return res.send("Database Error");
      }

      res.render("admin/products", {
        products: results
      });

    }
  );
};

// LOGOUT

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/admin/login");
  });
};

// ADD PRODUCT PAGE

exports.addProductPage = (req, res) => {
  res.render("admin/add-product");
};

// ADD PRODUCT

exports.addProduct = (req, res) => {
  const slug = slugify(req.body.name, { lower: true });

const data = {
  ...req.body,
  slug,
  image: req.files?.image ? req.files.image[0].filename : "",
  pdf: req.files?.pdf ? req.files.pdf[0].filename : "",
};

  Product.addProduct(data, (err) => {
    if (err) {
      console.log(err);
      return res.send("Error Adding Product");
    }

    res.redirect("/admin/dashboard");
  });
};

// DELETE PRODUCT

exports.deleteProduct = (req, res) => {
  Product.deleteProduct(req.params.id, (err) => {
    if (err) {
      console.log(err);
      return res.send("Delete Failed");
    }

    res.redirect("/admin/dashboard");
  });
};

// EDIT PRODUCT PAGE

exports.editProductPage = (req, res) => {
  Product.getProductById(req.params.id, (err, results) => {
    if (err) {
      console.log(err);
      return res.send("Database Error");
    }

    if (!results.length) {
      return res.send("Product Not Found");
    }

    res.render("admin/edit-product", {
      product: results[0],
    });
  });
};

// UPDATE PRODUCT

exports.updateProduct = (req, res) => {
  const slug = slugify(req.body.name, { lower: true });

  const data = {
    ...req.body,
    slug,
  };

  Product.updateProduct(req.params.id, data, (err) => {
    if (err) {
      console.log(err);
      return res.send("Update Failed");
    }

    res.redirect("/admin/dashboard");
  });
};