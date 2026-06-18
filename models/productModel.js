const db = require("../config/db");

// FILTER PRODUCTS

exports.getFilteredProducts = (filters, callback) => {
  let sql = "SELECT * FROM products WHERE 1=1";

  let values = [];

  // TYPE FILTER

  if (filters.type) {
    sql += " AND type=?";

    values.push(filters.type);
  }

  // RATING FILTER

  if (filters.rating) {
    sql += " AND currentRating=?";

    values.push(filters.rating);
  }

  // CURVE FILTER

  if (filters.curve) {
    sql += " AND curveType=?";

    values.push(filters.curve);
  }

  // POLE FILTER

  if (filters.poles) {
    sql += " AND poles=?";

    values.push(filters.poles);
  }

  // SEARCH

  if (filters.search) {
    sql += " AND name LIKE ?";

    values.push(`%${filters.search}%`);
  }

  // SORTING

  if (filters.sort === "latest") {
    sql += " ORDER BY id DESC";
  } else if (filters.sort === "oldest") {
    sql += " ORDER BY id ASC";
  } else {
    sql += " ORDER BY id DESC";
  }

  db.query(sql, values, callback);
};

// SINGLE PRODUCT

exports.getSingleProduct = (slug, callback) => {
  db.query(
    "SELECT * FROM products WHERE slug=?",

    [slug],

    callback,
  );
};

// ADD PRODUCT

exports.addProduct = (data, callback) => {
  const sql = `INSERT INTO products
    (

        name,
        slug,
        category,
        type,
        brand,
        currentRating,
        curveType,
        poles,
        image,
        pdf,
        short_description,
        full_description,
        meta_title,
        meta_description,
        status

    )

    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(
    sql,

    [
      data.name,
      data.slug,
      data.category,
      data.type,
      data.brand,
      data.currentRating,
      data.curveType,
      data.poles,
      data.image,
      data.pdf,
      data.short_description,
      data.full_description,
      data.meta_title,
      data.meta_description,
      data.status,
    ],

    callback,
  );
};

// DELETE PRODUCT

exports.deleteProduct = (id, callback) => {
  db.query(
    "DELETE FROM products WHERE id=?",

    [id],

    callback,
  );
};

// GET PRODUCT BY ID

exports.getProductById = (id, callback) => {
  db.query(
    "SELECT * FROM products WHERE id=?",

    [id],

    callback,
  );
};

// UPDATE PRODUCT

exports.updateProduct = (id, data, callback) => {
  const sql = `UPDATE products SET

    name=?,
    slug=?,
    category=?,
    type=?,
    brand=?,
    currentRating=?,
    curveType=?,
    poles=?,
    short_description=?,
    full_description=?,
    meta_title=?,
    meta_description=?,
    status=?

    WHERE id=?`;

  db.query(
    sql,

    [
      data.name,
      data.slug,
      data.category,
      data.type,
      data.brand,
      data.currentRating,
      data.curveType,
      data.poles,
      data.short_description,
      data.full_description,
      data.meta_title,
      data.meta_description,
      data.status,
      id,
    ],

    callback,
  );
};
