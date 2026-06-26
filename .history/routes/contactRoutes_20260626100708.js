const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

// CONTACT PAGE
router.get("/contact", (req, res) => {
  res.render("contact", {
    success: null
  });
});

// SEND EMAIL
router.post("/contact", async (req, res) => {
  try {
    // Destructure the updated input names from the form
    const { firstName, lastName, phone, email, company, topic, message } =
      req.body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: email,
      to: process.env.EMAIL_USER,
      subject: `New Contact Inquiry: ${topic || "General"}`,
      html: `
        <h3>New Inquiry Received</h3>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "N/A"}</p>
        <p><strong>Company/Project:</strong> ${company || "N/A"}</p>
        <p><strong>Enquiry Type:</strong> ${topic || "N/A"}</p>
        <hr />
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    res.render("contact", {
      success: "Email Sent Successfully",
    });
  } catch (error) {
    console.error(error);
    res.render("contact", {
      success: "Failed To Send Email",
    });
  }
});

module.exports = router;
