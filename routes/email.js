const express = require("express");
const router = express.Router();
const Email = require("../model/emailModel");
const nodemailer = require("nodemailer");

// POST /api/emails
router.post("/sendEmail", async (req, res) => {
  const { to, subject, message } = req.body;

  try {
    // Save email to database
    const email = new Email({ to, subject, message });
    await email.save();

    // Send email
    await sendEmail(to, subject, message);

    res.status(201).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res
      .status(500)
      .json({ error: "Failed to send email. Please try again later." });
  }
});

async function sendEmail(to, subject, message) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: "your-email@gmail.com",
      to,
      subject,
      text: message,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent:", mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
}

module.exports = router;
