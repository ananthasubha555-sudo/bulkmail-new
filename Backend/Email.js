const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema({
  subject: String,
  body: String,
  recipients: [String],
  failedEmails: [String],
  status: {
    type: String,
    enum: ["Sent", "Partial"],
    default: "Sent"
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Email", emailSchema);
