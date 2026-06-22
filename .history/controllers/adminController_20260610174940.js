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

// LOGIN

exports.login = (req, res) => {
  console.log("REQ BODY:", req.body);

  if (!req.body) {
    return res.send("Form data not received");
  }

  const { email, password } = req.body;

  User.findUserByEmail(email, async (err, results) => {
    if (err) {
      console.log(err);
      return res.send("Database Error");
    }

    if (results.length > 0) {
      const user = results[0];

      const match = await bcrypt.compare(password, user.password);

      if (match) {
        req.session.user = user;
        return res.redirect("/admin/dashboard");
      } else {
        return res.send("Invalid Password");
      }
    } else {
      return res.send("User Not Found");
    }
  });
};

// DASHBOARD

exports.dashboard = (req, res) => {
  db.query(
    "SELECT * FROM products ORDER BY id DESC",

    (err, results) => {
      res.render("admin/dashboard", {
        products: results,
      });
    },
  );
};

// LOGOUT

exports.logout = (req, res) => {
  req.session.destroy();

  res.redirect("/admin/login");
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

    slug: slug,

    image: req.files.image ? req.files.image[0].filename : "",

    pdf: req.files.pdf ? req.files.pdf[0].filename : "",
  };

  Product.addProduct(
    data,

    (err) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/admin/dashboard");
      }
    },
  );
};

// DELETE PRODUCT

exports.deleteProduct = (req, res) => {
  Product.deleteProduct(
    req.params.id,

    () => {
      res.redirect("/admin/dashboard");
    },
  );
};

// EDIT PAGE

exports.editProductPage = (req, res) => {
  Product.getProductById(
    req.params.id,

    (err, results) => {
      res.render("admin/edit-product", {
        product: results[0],
      });
    },
  );
};

// UPDATE PRODUCT

exports.updateProduct = (req, res) => {
  const slug = slugify(req.body.name, { lower: true });

  const data = {
    ...req.body,

    slug: slug,
  };

  Product.updateProduct(
    req.params.id,

    data,

    () => {
      res.redirect("/admin/dashboard");
    },
  );
};
