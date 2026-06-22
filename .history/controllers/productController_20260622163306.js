const Product = require("../models/productModel");
const db = require("../config/db");
// PRODUCTS PAGE

exports.homePage = (req, res) => {
  const filters = {
    type: req.query.type || "",

    rating: req.query.rating || "",

    curve: req.query.curve || "",

    poles: req.query.poles || "",

    search: req.query.search || "",

    sort: req.query.sort || "",

    page: parseInt(req.query.page) || 1,
  };

  Product.getFilteredProducts(
    filters,

    (err, results) => {
      if (err) {
        console.log(err);
      } else {
        const perPage = 8;

        const start = (filters.page - 1) * perPage;

        const end = start + perPage;

        const paginatedProducts = results.slice(start, end);

        const totalPages = Math.ceil(results.length / perPage);

        res.render("products", {
          products: paginatedProducts,

          filters,

          totalPages,
        });
      }
    },
  );
};

// SINGLE PRODUCT
// SINGLE PRODUCT

exports.singleProduct = (req, res) => {
  Product.getSingleProduct(req.params.slug, (err, results) => {
    if (err) {
      console.log(err);
      return res.send("Database Error");
    }

    if (!results.length) {
      return res.send("Product Not Found");
    }

    const product = results[0];

    Product.getFilteredProducts(
      { type: product.type },
      (err, relatedProducts) => {
        if (err) {
          console.log(err);
          relatedProducts = [];
        }

        res.render("single-product", {
          product,
          relatedProducts,
        });
      }
    );
  });
};


exports.categoryListing = (req, res) => {

  const categorySlug = req.params.category;

  db.query(
    `
    SELECT DISTINCT brand
    FROM products
    WHERE LOWER(REPLACE(category,' ','-')) = ?
    `,
    [categorySlug],
    (err, results) => {

      if (err) {
        console.log(err);
        return res.send("Database Error");
      }

      const brands = results.map(item => ({
        name: item.brand,
        slug: item.brand.toLowerCase().replace(/\s+/g, "-")
      }));

      res.render("category/category-listing", {
        categoryName: categorySlug
          .replace(/-/g, " ")
          .replace(/\b\w/g, l => l.toUpperCase()),
        categorySlug,
        brands
      });

    }
  );
};


exports.brandListing = (req, res) => {

  const categorySlug = req.params.category;
  const brandSlug = req.params.brand;

  db.query(
    `
    SELECT DISTINCT subcategory
    FROM products
    WHERE LOWER(REPLACE(category,' ','-')) = ?
    AND LOWER(REPLACE(brand,' ','-')) = ?
    `,
    [categorySlug, brandSlug],
    (err, results) => {

      if (err) {
        console.log(err);
        return res.send("Database Error");
      }

      const subcategories = results.map(item => ({
        name: item.subcategory,
        slug: item.subcategory.toLowerCase().replace(/\s+/g, "-")
      }));

      res.render("brand/brand-listing", {
        categoryName: categorySlug
          .replace(/-/g, " ")
          .replace(/\b\w/g, l => l.toUpperCase()),

        categorySlug,

        brandName: brandSlug
          .replace(/-/g, " ")
          .replace(/\b\w/g, l => l.toUpperCase()),

        brandSlug,

        subcategories
      });

    }
  );
};