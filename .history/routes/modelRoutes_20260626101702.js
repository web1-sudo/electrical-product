const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

// Model PAGE - GET Route
router.get("/model", (req, res) => {
  res.render("model", { success: "" });
});

// SEND EMAIL - POST Route
router.post("/model", async (req, res) => {
  try {
    // Destructure the input names directly from your HTML form
    const {
      first_name_model,
      last_name_model,
      email_address_model,
      phone_model,
      company_project_model,
      topic,
      massage_model,
    } = req.body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,

      replyTo: email_address_model,

      to: process.env.EMAIL_USER,
      subject: `New Quick Enquiry From Website: ${topic || "General"}`,
      html: `
        <h3>New Enquiry Received</h3>
        <p><strong>Name:</strong> ${first_name_model} ${last_name_model}</p>
        <p><strong>Email:</strong> ${email_address_model}</p>
        <p><strong>Phone:</strong> ${phone_model || "N/A"}</p>
        <p><strong>Company/Project:</strong> ${company_project_model || "N/A"}</p>
        <p><strong>Topic:</strong> ${topic || "N/A"}</p>
        <hr />
        <p><strong>Message:</strong></p>
        <p>${massage_model}</p>
      `,
    });

  return res.json({
  success: true,
  message: "Email Sent Successfully"
});
  } catch (error) {
    console.error("Mail Server Error Log:", error);
    res.render("index", {
      success: "Failed To Send Email",
    });
  }
});

module.exports = router;
