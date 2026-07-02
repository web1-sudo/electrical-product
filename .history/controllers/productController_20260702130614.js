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

    // page: parseInt(req.query.page) || 1,
  };

  Product.getFilteredProducts(
    filters,

    (err, results) => {
      if (err) {
        console.log(err);
      } else {
        // const perPage = 9;

        // const start = (filters.page - 1) * perPage;

        // const end = start + perPage;

        // const paginatedProducts = results.slice(start, end);

        // const totalPages = Math.ceil(results.length / perPage);

        res.render("products", {
          // products: paginatedProducts,
products: results,

          filters,

          // totalPages,
        });
      }
    },
  );
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

       res.render("product/product", {
  product,
  relatedProducts,

  categorySlug: product.category
    .toLowerCase()
    .replace(/\s+/g, "-"),

  brandSlug: product.brand
    .toLowerCase()
    .replace(/\s+/g, "-"),

  subcategorySlug: product.subcategory
    ? product.subcategory.toLowerCase().replace(/\s+/g, "-")
    : ""
});

        }
      );

    }
  );

};




exports.brandListing = (req, res) => {

  const categorySlug = req.params.category;
  const brandSlug = req.params.brand;

  const activeTab = req.query.tab || "mcb";

  let sql = `
    SELECT *
    FROM products
    WHERE LOWER(REPLACE(category,' ','-')) = ?
    AND LOWER(REPLACE(brand,' ','-')) = ?
  `;

  const values = [
    categorySlug,
    brandSlug
  ];

  // =========================
  // Curve Type
  // =========================

  if (req.query.curve_type) {

    const curveTypes = Array.isArray(req.query.curve_type)
      ? req.query.curve_type
      : [req.query.curve_type];

    sql += ` AND curve_type IN (${curveTypes.map(() => "?").join(",")})`;

    values.push(...curveTypes);

  }

  // =========================
  // EQ9 Tabs
  // =========================

  if (brandSlug === "eq9") {

    if (activeTab === "mcb") {
      sql += ` AND LOWER(REPLACE(subcategory,' ','-'))='mcb'`;
    }

    if (activeTab === "isolator") {
      sql += ` AND LOWER(REPLACE(subcategory,' ','-'))='isolator'`;
    }

  }

  // =========================
  // Distribution Board Tabs
  // =========================

  if (categorySlug === "distribution-boards") {

    if (activeTab === "auralis") {
      sql += ` AND LOWER(REPLACE(brand,' ','-'))='auralis'`;
    }

    if (activeTab === "elvo") {
      sql += ` AND LOWER(REPLACE(brand,' ','-'))='elvo'`;
    }

    if (activeTab === "avina") {
      sql += ` AND LOWER(REPLACE(brand,' ','-'))='avina'`;
    }

  }

  // =========================
  // Rating Filter
  // =========================

  if (req.query.rating) {

    const ratings = Array.isArray(req.query.rating)
      ? req.query.rating
      : [req.query.rating];

    sql += ` AND rating IN (${ratings.map(() => "?").join(",")})`;

    values.push(...ratings);

  }

  // =========================
  // Pole Filter
  // =========================

  if (req.query.poles) {

    const poles = Array.isArray(req.query.poles)
      ? req.query.poles
      : [req.query.poles];

    sql += ` AND poles IN (${poles.map(() => "?").join(",")})`;

    values.push(...poles);

  }

  // =========================
  // Boards Filter
  // =========================

  if (req.query.boards) {

    const boards = Array.isArray(req.query.boards)
      ? req.query.boards
      : [req.query.boards];

    sql += ` AND boards IN (${boards.map(() => "?").join(",")})`;

    values.push(...boards);

  }

  // =========================
  // Board Type Filter
  // =========================

if (req.query.boards_type) {

    const boardFilters = Array.isArray(req.query.boards_type)
        ? req.query.boards_type
        : [req.query.boards_type];

    sql += ` AND (`;

    boardFilters.forEach((item, index) => {

        if (index > 0) {
            sql += ` OR `;
        }

        sql += `(boards = ? AND boards_type = ?)`;

        const [board, type] = item.split("|");

        values.push(board, type);

    });

    sql += `)`;

}

  console.log(sql);
  console.log(values);

  db.query(sql, values, (err, results) => {

    if (err) {
      console.log(err);
      return res.send("Database Error");
    }

    const products = results;

    const ratings = [
      ...new Set(results.map(item => item.rating).filter(Boolean))
    ];

    const curve_type = [
      ...new Set(results.map(item => item.curve_type).filter(Boolean))
    ];

    const poles = [
      ...new Set(results.map(item => item.poles).filter(Boolean))
    ];

    // SECOND QUERY - BUILD FILTERS


        db.query(
      `
      SELECT *
      FROM products
      WHERE LOWER(REPLACE(category,' ','-')) = ?
      AND LOWER(REPLACE(brand,' ','-')) = ?
      `,
      [categorySlug, brandSlug],
      (err, allProducts) => {

        if (err) {
          console.log(err);
          return res.send("Database Error");
        }

        // Build Distribution Board Filters from ALL products
        const boardGroups = {};

        allProducts.forEach(item => {

          if (!item.boards || !item.boards_type) return;

          if (!boardGroups[item.boards]) {
            boardGroups[item.boards] = [];
          }

          if (!boardGroups[item.boards].includes(item.boards_type)) {
            boardGroups[item.boards].push(item.boards_type);
          }

        });

        const boards = Object.keys(boardGroups);

        const boardTypes = [
          ...new Set(
            allProducts
              .map(item => item.boards_type)
              .filter(Boolean)
          )
        ];

        const boardStructure = boards.map(board => ({
          board,
          types: boardGroups[board]
        }));

console.log("REQ QUERY:", req.query);

        res.render("brand/brand-listing", {

          categoryName: categorySlug
            .replace(/-/g, " ")
            .replace(/\b\w/g, l => l.toUpperCase()),

          categorySlug,

          brandName: brandSlug
            .replace(/-/g, " ")
            .replace(/\b\w/g, l => l.toUpperCase()),

          brandSlug,

          activeTab,

          products,
          ratings,
          curve_type,
          poles,
          boards,
          boardTypes,
          boardStructure,

          selectedFilters: req.query

        });

      }
    );

  });

};

console.log(module.exports);
