const express = require("express");
const router = express.Router();

const upload = require("../config/multer");

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
  forgotPassword,
  forgotPasswordPage
} = require("../controllers/adminController");

const { isLoggedIn } = require("../middleware/authMiddleware");

// LOGIN

router.get("/login", loginPage);
router.post("/login", login);

// FORGOT PASSWORD

router.get("/forgot-password", forgotPasswordPage);
router.post("/forgot-password", forgotPassword);

// DASHBOARD

router.get("/dashboard", isLoggedIn, dashboard);

// LOGOUT

router.get("/logout", isLoggedIn, logout);

// ADD PRODUCT

router.get("/add-product", isLoggedIn, addProductPage);

router.post(
  "/add-product",
  isLoggedIn,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "pdf", maxCount: 1 }
  ]),
  addProduct
);

// EDIT PRODUCT

router.get(
  "/edit-product/:id",
  isLoggedIn,
  editProductPage
);

router.post(
  "/edit-product/:id",
  isLoggedIn,
  updateProduct
);

// DELETE PRODUCT

router.get(
  "/delete-product/:id",
  isLoggedIn,
  deleteProduct
);

module.exports = router;