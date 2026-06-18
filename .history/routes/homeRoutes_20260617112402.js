const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

// Support / Home PAGE - GET Route
router.get("/index", (req, res) => {
  res.render("index", { success: "" });
});

// SEND EMAIL - POST Route
router.post("/index", async (req, res) => {
  try {
    // Destructure the input names directly from your HTML form
    const {
      name_enquiry,
      email_enquiry,
      company_project_enquiry,
      product_interest_enquiry,
    } = req.body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      // FIXED: Must use your authenticated email here so Gmail accepts the request
      from: process.env.EMAIL_USER,

      // FIXED: Maps the customer email here so you can reply directly to them
      replyTo: email_enquiry,

      to: process.env.EMAIL_USER,
      subject: `New Enquiry From Website : ${product_interest_enquiry || "General"}`,
      html: `
        <h3>New Inquiry Received</h3>
        <p><strong>Name:</strong> ${name_enquiry} </p>
        <p><strong>Email:</strong> ${email_enquiry}</p>
        <p><strong>Company/Project:</strong> ${company_project_enquiry || "N/A"}</p>
        <p><strong>Product Interest:</strong> ${product_interest_enquiry || "N/A"}</p>
      `,
    });

    // FIXED: Changed "home" to "index" to resolve the template lookup crash
    res.render("index", {
      success: "Email Sent Successfully",
    });
  } catch (error) {
    console.error("Mail Server Error Log:", error);

    // FIXED: Changed "home" to "index" to resolve the template lookup crash
    res.render("index", {
      success: "Failed To Send Email",
    });
  }
});

module.exports = router;
