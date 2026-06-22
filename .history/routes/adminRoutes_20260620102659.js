const upload = require("../config/multer");

const express = require("express");

const router = express.Router();

const {
  loginPage,
  login,
  dashboard,
  logout,
  addProductPage,
  addProduct,
  deleteProduct,
  editProductPage,
  updateProduct,
} = require("../controllers/adminController");

console.log({
  loginPage,
  login,
  dashboard,
  logout,
  addProductPage,
  addProduct,
  deleteProduct,
  editProductPage,
  updateProduct,
});

const { isLoggedIn } = require("../middleware/authMiddleware");

// LOGIN PAGE

router.get("/login", loginPage);

// LOGIN

router.post("/login", login);

// DASHBOARD

router.get(
  "/dashboard",

  isLoggedIn,

  dashboard,
);

// LOGOUT

router.get(
  "/logout",

  logout,
);

// ADD PRODUCT PAGE

router.get(
  "/add-product",

  isLoggedIn,

  addProductPage,
);

// ADD PRODUCT

router.post(
  "/add-product",

  isLoggedIn,

  upload.fields([{ name: "image" }, { name: "pdf" }]),

  addProduct,
);

// DELETE PRODUCT

router.get(
  "/delete-product/:id",

  isLoggedIn,

  deleteProduct,
);

// EDIT PAGE

router.get(
  "/edit-product/:id",

  isLoggedIn,

  editProductPage,
);

// UPDATE PRODUCT

router.post(
  "/edit-product/:id",

  isLoggedIn,

  updateProduct,
);

module.exports = router;
