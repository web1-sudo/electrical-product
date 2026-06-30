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
    catalog_pdf,
    meta_title,
    meta_description,
    rating,
    boards,
    boards_type,
    poles,
    curve_type,

    variant1_name,
    variant1_catalogue,
    variant1_datasheet,
    variant1_catalog,
    variant1_installation,

    variant2_name,
    variant2_catalogue,
    variant2_datasheet,
    variant2_catalog,
    variant2_installation,

    variant3_name,
    variant3_catalogue,
    variant3_datasheet,
    variant3_catalog,
    variant3_installation,

    variant4_name,
    variant4_catalogue,
    variant4_datasheet,
    variant4_catalog,
    variant4_installation
)

VALUES (
?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,

?,?,?,?,?,

?,?,?,?,?,

?,?,?,?,?,

?,?,?,?,?
)
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
      data.catalog_pdf,
      data.meta_title,
      data.meta_description,
      data.rating,
      data.boards,
      data.boards_type,
      data.poles,
      data.curve_type,
      // Variant 1
data.variant1_name,
data.variant1_catalogue,
data.variant1_datasheet,
data.variant1_catalog,
data.variant1_installation,

// Variant 2
data.variant2_name,
data.variant2_catalogue,
data.variant2_datasheet,
data.variant2_catalog,
data.variant2_installation,

// Variant 3
data.variant3_name,
data.variant3_catalogue,
data.variant3_datasheet,
data.variant3_catalog,
data.variant3_installation,

// Variant 4
data.variant4_name,
data.variant4_catalogue,
data.variant4_datasheet,
data.variant4_catalog,
data.variant4_installation
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

name=?,
slug=?,
brand=?,
category=?,
subcategory=?,
description=?,
meta_title=?,
meta_description=?,

image=?,
image2=?,
image3=?,

pdf=?,
catalog_pdf=?,

rating=?,
poles=?,
boards=?,
boards_type=?,
curve_type=?,

variant1_name=?,
variant1_catalogue=?,
variant1_datasheet=?,
variant1_catalog=?,
variant1_installation=?,

variant2_name=?,
variant2_catalogue=?,
variant2_datasheet=?,
variant2_catalog=?,
variant2_installation=?,

variant3_name=?,
variant3_catalogue=?,
variant3_datasheet=?,
variant3_catalog=?,
variant3_installation=?,

variant4_name=?,
variant4_catalogue=?,
variant4_datasheet=?,
variant4_catalog=?,
variant4_installation=?

WHERE id=?
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
      data.pdf,
      data.catalog_pdf,
      data.rating,
      data.poles,
      data.boards,
      data.boards_type,
      data.curve_type,
      data.variant1_name,
data.variant1_catalogue,
data.variant1_datasheet,
data.variant1_catalog,
data.variant1_installation,

data.variant2_name,
data.variant2_catalogue,
data.variant2_datasheet,
data.variant2_catalog,
data.variant2_installation,

data.variant3_name,
data.variant3_catalogue,
data.variant3_datasheet,
data.variant3_catalog,
data.variant3_installation,

data.variant4_name,
data.variant4_catalogue,
data.variant4_datasheet,
data.variant4_catalog,
data.variant4_installation,

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