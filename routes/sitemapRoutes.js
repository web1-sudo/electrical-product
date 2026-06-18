const express = require("express");

const router = express.Router();

const db = require("../config/db");

router.get(
  "/sitemap.xml",

  (req, res) => {
    db.query(
      "SELECT * FROM products",

      (err, products) => {
        let xml = `<?xml version="1.0" encoding="UTF-8"?>

<urlset
xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

        products.forEach((product) => {
          xml += `

<url>

<loc>

http://localhost:3000/product/${product.slug}

</loc>

</url>

`;
        });

        xml += `</urlset>`;

        res.header("Content-Type", "application/xml");

        res.send(xml);
      },
    );
  },
);

module.exports = router;
