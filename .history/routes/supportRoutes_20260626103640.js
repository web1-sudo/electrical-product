const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

// Support PAGE
router.get("/support", (req, res) => {
  res.render("support", {
    success: null
  });
});

// SEND EMAIL
router.post("/support", async (req, res) => {
  try {
    // Destructure the input names directly from your HTML form
    const {
      first_name_support,
      last_name_support,
      phone_support,
      email_address_support,
      company_project_support,
      topic,
      massage_support, // Spelled with 'a' to match your textarea name attribute
    } = req.body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: email_address_support, // FIXED: Changed 'email' to 'email_address_support'
      to: process.env.EMAIL_USER,
      subject: `New Support Inquiry: ${topic || "General"}`,
      html: `
        <h3>New Inquiry Received</h3>
        <p><strong>Name:</strong> ${first_name_support} ${last_name_support}</p>
        <p><strong>Email:</strong> ${email_address_support}</p>
        <p><strong>Phone:</strong> ${phone_support || "N/A"}</p>
        <p><strong>Company/Project:</strong> ${company_project_support || "N/A"}</p>
        <p><strong>Topic:</strong> ${topic || "N/A"}</p>
        <hr />
        <p><strong>Message:</strong></p>
        <p>${massage_support}</p>
      `,
    });

    // FIXED: Removed the accidental space before "support"
    res.render("support", {
      success: "Email Sent Successfully",
    });
  } catch (error) {
    console.error(error);
    // FIXED: Removed the accidental space before "support"
    res.render("support", {
      success: "Failed To Send Email",
    });
  }
});

module.exports = router;
