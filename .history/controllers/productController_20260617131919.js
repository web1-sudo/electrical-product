const Product = require("../models/productModel");

// PRODUCTS PAGE

exports.homePage = (req, res) => {
  const filters = {
    type: req.query.type || "",

    rating: req.query.rating || "",

    curve: req.query.curve || "",

    poles: req.query.poles || "",

    search: req.query.search || "",

    sort: req.query.sort || "",

    page: parseInt(req.query.page) || 1,
  };

  Product.getFilteredProducts(
    filters,

    (err, results) => {
      if (err) {
        console.log(err);
      } else {
        const perPage = 8;

        const start = (filters.page - 1) * perPage;

        const end = start + perPage;

        const paginatedProducts = results.slice(start, end);

        const totalPages = Math.ceil(results.length / perPage);

        res.render("products", {
          products: paginatedProducts,

          filters,

          totalPages,
        });
      }
    },
  );
};

// SINGLE PRODUCT
exports.singleProduct = (req, res) => {
  Product.getSingleProduct(
    req.params.slug,

    (err, results) => {
      if (err) {
        console.log(err);
      } else {
        const product = results[0];

        Product.getFilteredProducts(
          {
            type: product.type,
          },

          (err, relatedProducts) => {
            res.render("single-product", {
              product,

              relatedProducts,
            });
          },
        );
      }
    },
  );
};
