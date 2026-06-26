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




exports.categoryListing = (req, res) => {

  const categorySlug = req.params.category;

  // const page = parseInt(req.query.page) || 1;
  // const perPage = 9;

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

      // const totalItems = brands.length;
      // const totalPages = Math.ceil(totalItems / perPage);

      // const start = (page - 1) * perPage;
      // const end = start + perPage;

      // const paginatedBrands = brands.slice(start, end);


      products,

      res.render("category/category-listing", {

        categoryName: categorySlug
          .replace(/-/g, " ")
          .replace(/\b\w/g, l => l.toUpperCase()),

        categorySlug,

        // brands: paginatedBrands,
brands,

        // page,
        // totalPages


       
      });

    }
  );

};


exports.brandListing = (req, res) => {

const categorySlug = req.params.category;
const brandSlug = req.params.brand;

const activeTab = req.query.tab || "mcb";

const page = parseInt(req.query.page) || 1;
const perPage = 9;

let sql = `SELECT * FROM products WHERE LOWER(REPLACE(category,' ','-')) = ? AND LOWER(REPLACE(brand,' ','-')) = ?`;

const values = [
categorySlug,
brandSlug
];

// =========================
// TAB FILTERS
// =========================

if (brandSlug === "eq9") {

if (activeTab === "mcb") {
  sql += ` AND LOWER(REPLACE(subcategory,' ','-')) = 'mcb'`;
}

if (activeTab === "isolator") {
  sql += ` AND LOWER(REPLACE(subcategory,' ','-')) = 'isolator'`;
}

}
// =========================
// DISTRIBUTION BOARD TABS
// =========================

if (categorySlug === "distribution-boards") {

  if (activeTab === "auralis") {
    sql += ` AND LOWER(REPLACE(brand,' ','-')) = 'auralis'`;
  }

  if (activeTab === "elvo") {
    sql += ` AND LOWER(REPLACE(brand,' ','-')) = 'elvo'`;
  }

  if (activeTab === "avina") {
    sql += ` AND LOWER(REPLACE(brand,' ','-')) = 'avina'`;
  }

}
// =========================
// FILTERS
// =========================

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

db.query(sql, values, (err, results) => {

if (err) {
  console.log(err);
  return res.send("Database Error");
}

// const subcategories = [
//   ...new Map(
//     results.map(item => [
//       item.subcategory,
//       {
//         name: item.subcategory,
//         slug: item.subcategory.toLowerCase().replace(/\s+/g, "-"),
//         image: item.image
//       }
//     ])
//   ).values()
// ];
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

const boards = [
  ...new Set(results.map(item => item.boards).filter(Boolean))
];

const boardTypes = [
  ...new Set(results.map(item => item.boards_type).filter(Boolean))
];

// Auralis board structure
const boardGroups = {};

results.forEach(item => {

  if (!item.boards || !item.boards_type) return;

  if (!boardGroups[item.boards]) {
    boardGroups[item.boards] = [];
  }

  if (!boardGroups[item.boards].includes(item.boards_type)) {
    boardGroups[item.boards].push(item.boards_type);
  }

});

const boardStructure = Object.keys(boardGroups).map(board => ({
  board,
  types: boardGroups[board]
}));



// const totalItems = subcategories.length;

const totalItems = products.length;

const totalPages = Math.ceil(totalItems / perPage);

const start = (page - 1) * perPage;
const end = start + perPage;

// const paginatedSubcategories = subcategories.slice(start, end);

const paginatedProducts = products.slice(start, end);

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

  // subcategories: paginatedSubcategories,

// products: paginatedProducts,
products,
  ratings,
  curve_type,
  poles,
  boards,
  boardTypes,

  selectedFilters: req.query,

  page,
  totalPages ,

   
  categorySlug,
  brandSlug,
  ratings,
  poles,
  boards,
  boardTypes,
  activeTab,
  boardStructure,
  selectedFilters: req.query,
  page,
  totalPages

});

});

};

exports.subcategoryListing = (req, res) => {

  const categorySlug = req.params.category;
  const brandSlug = req.params.brand;
  const subcategorySlug = req.params.subcategory;

  const page = parseInt(req.query.page) || 1;
  const perPage = 9;

 let sql = `
SELECT *
FROM products
WHERE LOWER(REPLACE(category,' ','-')) = ?
`;

const values = [categorySlug];

if (categorySlug !== "distribution-boards") {
  sql += `
    AND LOWER(REPLACE(brand,' ','-')) = ?
  `;

  values.push(brandSlug);
}

  if (req.query.rating) {

    const ratings = Array.isArray(req.query.rating)
      ? req.query.rating
      : [req.query.rating];

    sql += ` AND rating IN (${ratings.map(() => "?").join(",")})`;

    values.push(...ratings);
  }
if (req.query.curve_type) {

  const curveTypes = Array.isArray(req.query.curve_type)
    ? req.query.curve_type
    : [req.query.curve_type];

  sql += ` AND curve_type IN (${curveTypes.map(() => "?").join(",")})`;

  values.push(...curveTypes);

}

  if (req.query.poles) {

    const poles = Array.isArray(req.query.poles)
      ? req.query.poles
      : [req.query.poles];

    sql += ` AND poles IN (${poles.map(() => "?").join(",")})`;

    values.push(...poles);
  }

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

  db.query(sql, values, (err, products) => {

    if (err) {
      console.log(err);
      return res.send("Database Error");
    }

    // const totalItems = products.length;
    // const totalPages = Math.ceil(totalItems / perPage);

    // const start = (page - 1) * perPage;
    // const end = start + perPage;

    // const paginatedProducts = products.slice(start, end);

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

      // products: paginatedProducts,
products,
      selectedFilters: req.query,

      // page,
      // totalPages
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


