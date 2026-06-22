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

// =====================
// LOGIN PAGE
// =====================

router.get("/login", loginPage);

// =====================
// LOGIN
// =====================

router.post("/login", login);

// =====================
// FORGOT PASSWORD
// =====================

router.post("/forgot-password", forgotPassword);

// =====================
// DASHBOARD
// =====================

router.get(
  "/dashboard",
  isLoggedIn,
  dashboard
);

// =====================
// LOGOUT
// =====================

router.get(
  "/logout",
  isLoggedIn,
  logout
);

// =====================
// ADD PRODUCT PAGE
// =====================

router.get(
  "/add-product",
  isLoggedIn,
  addProductPage
);

exports.forgotPasswordPage = (req, res) => {
  res.render("admin/forgot-password");
};

console.log({
  forgotPassword,
  forgotPasswordPage,
});

// =====================
// ADD PRODUCT
// =====================

router.post(
  "/add-product",
  isLoggedIn,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "pdf", maxCount: 1 }
  ]),
  addProduct
);

// =====================
// EDIT PRODUCT PAGE
// =====================

router.get(
  "/edit-product/:id",
  isLoggedIn,
  editProductPage
);

// =====================
// UPDATE PRODUCT
// =====================

router.post(
  "/edit-product/:id",
  isLoggedIn,
  updateProduct
);

// =====================
// DELETE PRODUCT
// =====================

router.get(
  "/delete-product/:id",
  isLoggedIn,
  deleteProduct
);

module.exports = router;