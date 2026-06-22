const db = require("../config/db");

// GET ALL / FILTER PRODUCTS

exports.getFilteredProducts = (filters, callback) => {
  let sql = "SELECT * FROM products WHERE 1=1";

  const values = [];

  if (filters.type) {
    sql += " AND type = ?";
    values.push(filters.type);
  }

  if (filters.category) {
    sql += " AND category = ?";
    values.push(filters.category);
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

exports.addProduct = (data, callback) => {
  const sql = `
    INSERT INTO products
    (
      name,
      slug,
      brand,
      category,
      subcategory,
      type,
      description,
      image,
      related_image_1,
      image3,
      pdf,
      meta_title,
      meta_description
    )
    VALUES (?, ?, ?, ?, ?, ?,?,?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      data.name,
      data.slug,
      data.brand,
      data.category,
      data.subcategory,
      data.type,
      data.description,
      data.image,
      data.related_image_1,
      data.image3,
      data.pdf,
      data.meta_title,
      data.meta_description,
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

exports.updateProduct = (id, data, callback) => {
  const sql = `
    UPDATE products SET
      name = ?,
      slug = ?,
      brand = ?,
      category = ?,
      subcategory = ?,
      type = ?,
      description = ?,
      image = ?,
      related_image_1 = ?,
      image3 = ?,
      meta_title = ?,
      meta_description = ?
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
      data.type,
      data.description,
      data.image,
      data.related_image_1,
      data.image3,
      data.meta_title,
      data.meta_description,
      id,
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