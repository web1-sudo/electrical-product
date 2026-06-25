const Product = require("../models/productModel");
const slugify = require("slugify");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const db = require("../config/db");

// LOGIN PAGE

exports.loginPage = (req, res) => {
  res.render("admin/login");
};

// LOGIN

exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.send("Email and Password are required");
  }

  User.findUserByEmail(email, async (err, results) => {
    if (err) {
      console.log(err);
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

    res.redirect("/admin/dashboard");
  });
};

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

  const slug = slugify(req.body.name, {
    lower: true,
    strict: true,
  });

const data = {
  name: req.body.name,
  slug,
  brand: req.body.brand,
  category: req.body.category,
  subcategory: req.body.subcategory,
  boards: req.body.boards,
  boards_type: req.body.boards_type,

  rating: req.body.rating,
  poles: req.body.poles,

  curve_type: req.body.curve_type,

  image: req.files?.image ? req.files.image[0].filename : "",
  pdf: req.files?.pdf ? req.files.pdf[0].filename : "",
catalog_pdf: req.files?.catalog_pdf
  ? req.files.catalog_pdf[0].filename
  : "",
  description: req.body.description,
  meta_title: req.body.meta_title,
  meta_description: req.body.meta_description,

  image2: req.files?.image2
    ? req.files.image2[0].filename
    : "",

  image3: req.files?.image3
    ? req.files.image3[0].filename
    : "",
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
  const slug = slugify(req.body.name, {
    lower: true,
    strict: true,
  });

  const data = {
    name: req.body.name,
    slug,
    brand: req.body.brand,
    category: req.body.category,
    subcategory: req.body.subcategory,
    description: req.body.description,
    meta_title: req.body.meta_title,
    meta_description: req.body.meta_description,
    curve_type: req.body.curve_type,
    rating: req.body.rating,
    boards: req.body.boards,
    boards_type: req.body.boards_type,
    poles: req.body.poles,

    image: req.files?.image ? req.files.image[0].filename : "",
    pdf: req.files?.pdf ? req.files.pdf[0].filename : "",

    image2: req.files?.image2
      ? req.files.image2[0].filename
      : "",

    image3: req.files?.image3
      ? req.files.image3[0].filename
      : "",
  };

  Product.updateProduct(
    req.params.id,
    data,
    (err) => {
      if (err) {
        console.log(err);
        return res.send("Update Failed");
      }

      res.redirect("/admin/dashboard");
    }
  );
};