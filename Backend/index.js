const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const XLSX = require("xlsx");
const nodemailer = require("nodemailer");
require("dotenv").config();

const Email = require("./Email");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ Mongo Error:", err));

// Multer (memory)
const upload = multer({ storage: multer.memoryStorage() });

// Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.get("/", (req, res) => {
  res.send("Backend running ✅");
});

app.post("/sendemail", upload.single("file"), async (req, res) => {
  try {
    const { message } = req.body;
    const file = req.file;

    if (!message) return res.status(400).json({ message: "Message required ❌" });
    if (!file) return res.status(400).json({ message: "Excel file required ❌" });

    // Read Excel
    const workbook = XLSX.read(file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);

    const recipients = data.map(r => r.email).filter(Boolean);
    if (recipients.length === 0)
      return res.status(400).json({ message: "No valid emails found ❌" });

    const failedEmails = [];

    for (let mail of recipients) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: mail,
          subject: "Bulk Mail",
          text: message
        });
      } catch {
        failedEmails.push(mail);
      }
    }

    await Email.create({
      subject: "Bulk Mail",
      body: message,
      recipients,
      failedEmails,
      status: failedEmails.length === 0 ? "Sent" : "Partial"
    });

    res.json({
      message: "Emails processed successfully ✅",
      total: recipients.length,
      failed: failedEmails.length,
      failedEmails
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error ❌" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));
