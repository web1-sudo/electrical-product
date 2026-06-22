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
    type: req.body.type,
    description: req.body.description,
    meta_title: req.body.meta_title,
    meta_description: req.body.meta_description,
    image: req.files?.image
      ? req.files.image[0].filename
      : "",
    pdf: req.files?.pdf
      ? req.files.pdf[0].filename
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
    type: req.body.type,
    description: req.body.description,
    meta_title: req.body.meta_title,
    meta_description: req.body.meta_description,
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


const crypto = require("crypto");
const nodemailer = require("nodemailer");


exports.forgotPassword = (req, res) => {
  const { email } = req.body;

  const token = crypto.randomBytes(32).toString("hex");

  const expiry = new Date(Date.now() + 3600000);

  db.query(
    `UPDATE users
     SET reset_token=?, reset_token_expiry=?
     WHERE email=?`,
    [token, expiry, email],
    async (err) => {
      if (err) {
        console.log(err);
        return res.send("Database Error");
      }

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const resetLink =
        `http://localhost:3000/admin/reset-password/${token}`;

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Reset Password",
        html: `
          <h3>Reset Password</h3>
          <a href="${resetLink}">
            Click Here To Reset Password
          </a>
        `,
      });

      res.send("Password reset link sent.");
    }
  );
};