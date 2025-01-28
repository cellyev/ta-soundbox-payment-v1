const mongoose = require("mongoose");
const validator = require("validator");

const emailLogSchema = new mongoose.Schema({
  transaction_id: {
    type: String,
    required: true,
    unique: true,
  },
  customer_email: {
    type: String,
    required: true,
    validate: [validator.isEmail, "Invalid email address"],
  },
  email_link: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("EmailLogs", emailLogSchema);
