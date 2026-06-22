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
  productsPage,
} = require("../controllers/adminController");

const { isLoggedIn } = require("../middleware/authMiddleware");

// ======================
// LOGIN
// ======================

router.get("/login", loginPage);

router.post("/login", login);

// ======================
// DASHBOARD
// ======================

// router.get("/dashboard", isLoggedIn, dashboard);
router.get("/dashboard", dashboard);

// ======================
// LOGOUT
// ======================

router.get("/logout", logout);

// ======================
// ADD PRODUCT
// ======================

// router.get("/add-product", isLoggedIn, addProductPage);
router.get("/add-product", addProductPage);

router.post(
  "/add-product",
  upload.fields([
    { name: "image" },
    { name: "pdf" }
  ]),
  addProduct
);


exports.addProductPage = (req, res) => {
  res.render("admin/add-product");
};
// ======================
// DELETE PRODUCT
// ======================

router.get(
  "/delete-product/:id",
  isLoggedIn,
  deleteProduct
);

// ======================
// EDIT PRODUCT
// ======================

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


router.get(
  "/products",
  productsPage
);

module.exports = router;