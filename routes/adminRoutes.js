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

// =====================
// ADD PRODUCT
// =====================

router.post(
  "/add-product",
  isLoggedIn,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
    { name: "catalog_pdf", maxCount: 1 }
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
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
    { name: "catalog_pdf", maxCount: 1 }
  ]),
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


// brnad


module.exports = router;