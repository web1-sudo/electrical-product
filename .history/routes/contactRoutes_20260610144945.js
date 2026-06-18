const express = require("express");

const router = express.Router();

const nodemailer = require("nodemailer");

// CONTACT PAGE

router.get(
  "/contact",

  (req, res) => {
    res.render("contact", {
      success: "",
    });
  },
);

// SEND EMAIL

router.post(
  "/contact",

  async (req, res) => {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",

        auth: {
          user: process.env.EMAIL_USER,

          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: req.body.email,

        to: process.env.EMAIL_USER,

        subject: "New Contact Inquiry",

        html: `

<h3>
Name:
${req.body.name}
</h3>

<p>
Email:
${req.body.email}
</p>

<p>
${req.body.message}
</p>

`,
      });

      res.render("contact", {
        success: "Email Sent Successfully",
      });
    } catch (error) {
      console.log(error);

      res.render("contact", {
        success: "Failed To Send Email",
      });
    }
  },
);

module.exports = router;
