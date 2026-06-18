const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const multer = require("multer");
const path = require("path");

// Configure Multer
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// career PAGE GET
router.get("/career", (req, res) => {
  res.render("career", { success: "" });
});

// SEND EMAIL POST
router.post("/career", upload.single("resume_file"), async (req, res) => {
  try {
    const {
      first_name_career,
      last_name_career,
      phone_career,
      email_address_career,
      job_role,
      massage_career,
    } = req.body;

    const file = req.file;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      // CRITICAL: Must be your email (the one in process.env.EMAIL_USER)
      from: process.env.EMAIL_USER,

      // The applicant's email goes here so when you click "Reply", it goes to them
      replyTo: email_address_career,

      to: process.env.EMAIL_USER,
      subject: `New Career Application: ${job_role || "General"}`,
      html: `
        <h3>New Career Application Received</h3>
        <p><strong>Name:</strong> ${first_name_career} ${last_name_career}</p>
        <p><strong>Email:</strong> ${email_address_career}</p>
        <p><strong>Phone:</strong> ${phone_career || "N/A"}</p>
        <p><strong>Applied Job Role:</strong> ${job_role || "N/A"} </p>
        <hr />
        <p><strong>Message:</strong></p>
        <p>${massage_career}</p>
      `,
    };

    if (file) {
      mailOptions.attachments = [
        {
          filename: file.originalname,
          content: file.buffer,
        },
      ];
    }

    await transporter.sendMail(mailOptions);

    res.render("career", { success: "Email Sent Successfully" });
  } catch (error) {
    console.error(error);
    res.render("career", { success: "Failed To Send Email" });
  }
});

// CRITICAL FIX: Make sure this exact line is at the absolute bottom of the file!
module.exports = router;
