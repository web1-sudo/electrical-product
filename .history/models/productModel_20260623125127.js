const db = require("../config/db");

// GET ALL / FILTER PRODUCTS

exports.getFilteredProducts = (filters, callback) => {

  let sql = "SELECT * FROM products WHERE 1=1";

  const values = [];

  if (filters.category) {
    sql += " AND category = ?";
    values.push(filters.category);
  }

  if (filters.brand) {
    sql += " AND brand = ?";
    values.push(filters.brand);
  }

  if (filters.subcategory) {
    sql += " AND subcategory = ?";
    values.push(filters.subcategory);
  }

  if (filters.type) {
    sql += " AND type = ?";
    values.push(filters.type);
  }

  if (filters.search) {
    sql += " AND name LIKE ?";
    values.push(`%${filters.search}%`);
  }

  if (filters.sort === "oldest") {
    sql += " ORDER BY id ASC";
  } else {
    sql += " ORDER BY id DESC";
  }

  db.query(sql, values, callback);
};

// GET SINGLE PRODUCT

exports.getSingleProduct = (slug, callback) => {
  db.query(
    "SELECT * FROM products WHERE slug = ?",
    [slug],
    callback
  );
};

// ADD PRODUCT

// ADD PRODUCT

exports.addProduct = (data, callback) => {

  const sql = `
    INSERT INTO products (
      name,
      slug,
      brand,
      category,
      subcategory,
      description,
      image,
      image2,
      image3,
      pdf,
      meta_title,
      meta_description,
      rating,
      boards,
      boards_type,
      poles,
      curve_type

    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? , ?)
  `;

  db.query(
    sql,
    [
      data.name,
      data.slug,
      data.brand,
      data.category,
      data.subcategory,
      data.description,
      data.image,
      data.image2,
      data.image3,
      data.pdf,
      data.meta_title,
      data.meta_description,
      data.rating,
      data.boards,
      data.boards_type,
      data.poles,
      data.curve_type
    ],
    callback
  );

};

// DELETE PRODUCT

exports.deleteProduct = (id, callback) => {
  db.query(
    "DELETE FROM products WHERE id = ?",
    [id],
    callback
  );
};

// GET PRODUCT BY ID

exports.getProductById = (id, callback) => {
  db.query(
    "SELECT * FROM products WHERE id = ?",
    [id],
    callback
  );
};

// UPDATE PRODUCT

// UPDATE PRODUCT

exports.updateProduct = (id, data, callback) => {

  const sql = `
    UPDATE products SET
      name = ?,
      slug = ?,
      brand = ?,
      category = ?,
      subcategory = ?,
      description = ?,
      meta_title = ?,
      meta_description = ?,
      image = ?,
      image2 = ?,
      image3 = ?,
      rating = ?,
      poles = ?,
      boards = ?,
      boards_type = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [
      data.name,
      data.slug,
      data.brand,
      data.category,
      data.subcategory,
      data.description,
      data.meta_title,
      data.meta_description,
      data.image,
      data.image2,
      data.image3,
      data.rating,
      data.poles,
      data.boards,
      data.boards_type,
      id
    ],
    callback
  );

};
// GET RELATED PRODUCTS

exports.getRelatedProducts = (type, currentId, callback) => {
  db.query(
    "SELECT * FROM products WHERE type = ? AND id != ? ORDER BY id DESC LIMIT 8",
    [type, currentId],
    callback
  );
};