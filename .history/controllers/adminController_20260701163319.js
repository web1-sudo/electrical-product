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
Product.getProductById(req.params.id,(err,results)=>{

    if(err){
        console.log(err);
        return res.send("Database Error");
    }

    const oldProduct = results[0];

    

});
 



exports.updateProduct = (req, res) => {
 const slug = slugify(req.body.name, {
    lower: true,
    strict: true,
  });
    Product.getProductById(req.params.id, (err, results) => {

        if (err) {
            return res.send("Database Error");
        }

        const oldProduct = results[0];

       

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

 image: req.files?.image
    ? req.files.image[0].filename
    : oldProduct.image,
 pdf: req.files?.pdf
  ? req.files.pdf[0].filename
  : "",

catalog_pdf: req.files?.catalog_pdf
  ? req.files.catalog_pdf[0].filename
  : "",

// Variant 1
variant1_name: req.body.variant1_name,
variant1_catalogue: req.body.variant1_catalogue,
variant1_datasheet:
    req.files?.variant1_datasheet
        ? req.files.variant1_datasheet[0].filename
        : oldProduct.variant1_datasheet,
variant1_catalog: 
    req.files?.variant1_catalog
        ? req.files.variant1_catalog[0].filename
        : oldProduct.variant1_catalog,

        
variant1_installation: req.files?.variant1_installation
        ? req.files.variant1_installation[0].filename
        : oldProduct.variant1_installation,

// Variant 2
variant2_name: req.body.variant2_name,
variant2_catalogue: req.body.variant2_catalogue,
variant2_datasheet: req.files?.variant2_datasheet
        ? req.files.variant2_datasheet[0].filename
        : oldProduct.variant2_datasheet,
variant2_catalog: req.files?.variant2_catalog
  ? req.files.variant2_catalog[0].filename
  : "",
variant2_installation: req.files?.variant2_installation
  ? req.files.variant2_installation[0].filename
  : "",

// Variant 3
variant3_name: req.body.variant3_name,
variant3_catalogue: req.body.variant3_catalogue,
variant3_datasheet: req.files?.variant3_datasheet
  ? req.files.variant3_datasheet[0].filename
  : "",
variant3_catalog: req.files?.variant3_catalog
  ? req.files.variant3_catalog[0].filename
  : "",
variant3_installation: req.files?.variant3_installation
  ? req.files.variant3_installation[0].filename
  : "",

// Variant 4
variant4_name: req.body.variant4_name,
variant4_catalogue: req.body.variant4_catalogue,
variant4_datasheet: req.files?.variant4_datasheet
  ? req.files.variant4_datasheet[0].filename
  : "",
variant4_catalog: req.files?.variant4_catalog
  ? req.files.variant4_catalog[0].filename
  : "",
variant4_installation: req.files?.variant4_installation
  ? req.files.variant4_installation[0].filename
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

    });

};

 
};