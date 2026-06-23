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
    SELECT *
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

      // Subcategories

      const subcategories = [
        ...new Map(
          results.map(item => [
            item.subcategory,
            {
              name: item.subcategory,
              slug: item.subcategory.toLowerCase().replace(/\s+/g, "-"),
              image: item.image
            }
          ])
        ).values()
      ];

      // Filters

      const ratings = [
        ...new Set(
          results
            .map(item => item.rating)
            .filter(Boolean)
        )
      ];

      const poles = [
        ...new Set(
          results
            .map(item => item.poles)
            .filter(Boolean)
        )
      ];

      const boards = [
        ...new Set(
          results
            .map(item => item.boards)
            .filter(Boolean)
        )
      ];

      const boardTypes = [
        ...new Set(
          results
            .map(item => item.boards_type)
            .filter(Boolean)
        )
      ];

      res.render("brand/brand-listing", {

        categoryName: categorySlug
          .replace(/-/g, " ")
          .replace(/\b\w/g, l => l.toUpperCase()),

        categorySlug,

        brandName: brandSlug
          .replace(/-/g, " ")
          .replace(/\b\w/g, l => l.toUpperCase()),

        brandSlug,

        subcategories,

        ratings,
        poles,
        boards,
        boardTypes

      });

    }
  );

};


exports.subcategoryListing = (req, res) => {

    console.log("QUERY =", req.query);
  const categorySlug = req.params.category;
  const brandSlug = req.params.brand;
  const subcategorySlug = req.params.subcategory;

  let sql = `
    SELECT *
    FROM products
    WHERE LOWER(REPLACE(category,' ','-')) = ?
    AND LOWER(REPLACE(brand,' ','-')) = ?
    AND LOWER(REPLACE(subcategory,' ','-')) = ?
  `;

  const values = [
    categorySlug,
    brandSlug,
    subcategorySlug
  ];

  // EQ9 Filters
// EQ9 Filters

if (req.query.rating) {

  const ratings = Array.isArray(req.query.rating)
    ? req.query.rating
    : [req.query.rating];

  sql += ` AND rating IN (${ratings.map(() => "?").join(",")})`;

  values.push(...ratings);
}

if (req.query.poles) {

  const poles = Array.isArray(req.query.poles)
    ? req.query.poles
    : [req.query.poles];

  sql += ` AND poles IN (${poles.map(() => "?").join(",")})`;

  values.push(...poles);
}

// Only if you actually have curve_type column
if (req.query.curve_type) {

  const curves = Array.isArray(req.query.curve_type)
    ? req.query.curve_type
    : [req.query.curve_type];

  sql += ` AND curve_type IN (${curves.map(() => "?").join(",")})`;

  values.push(...curves);
}

// Distribution Board Filters

if (req.query.boards) {

  const boards = Array.isArray(req.query.boards)
    ? req.query.boards
    : [req.query.boards];

  sql += ` AND boards IN (${boards.map(() => "?").join(",")})`;

  values.push(...boards);
}

if (req.query.boards_type) {

  const boardTypes = Array.isArray(req.query.boards_type)
    ? req.query.boards_type
    : [req.query.boards_type];

  sql += ` AND boards_type IN (${boardTypes.map(() => "?").join(",")})`;

  values.push(...boardTypes);
}

console.log(sql);
console.log(values);

  db.query(sql, values, (err, products) => {

    if (err) {
      console.log(err);
      return res.send("Database Error");
    }

    res.render("subcategory/subcategory-listing", {

      categoryName: categorySlug
        .replace(/-/g, " ")
        .replace(/\b\w/g, l => l.toUpperCase()),

      categorySlug,

      brandName: brandSlug
        .replace(/-/g, " ")
        .replace(/\b\w/g, l => l.toUpperCase()),

      brandSlug,

      subcategoryName: subcategorySlug
        .replace(/-/g, " ")
        .replace(/\b\w/g, l => l.toUpperCase()),

      products

    });

  });

};

exports.singleProduct = (req, res) => {

  Product.getSingleProduct(
    req.params.slug,
    (err, results) => {

      if (err) {
        console.log(err);
        return res.send("Database Error");
      }

      if (!results.length) {
        return res.send("Product Not Found");
      }

      const product = results[0];

      db.query(
        `
        SELECT *
        FROM products
        WHERE brand = ?
        AND id != ?
        LIMIT 8
        `,
        [
          product.brand,
          product.id
        ],
        (err, relatedProducts) => {

          if (err) {
            console.log(err);
            relatedProducts = [];
          }

          res.render(
            "product/product",
            {
              product,
              relatedProducts
            }
          );

        }
      );

    }
  );

};


const page = parseInt(req.query.page) || 1;
const perPage = 12;
const totalItems = results.length;
const totalPages = Math.ceil(totalItems / perPage);

const start = (page - 1) * perPage;
const end = start + perPage;

const paginatedResults = results.slice(start, end);