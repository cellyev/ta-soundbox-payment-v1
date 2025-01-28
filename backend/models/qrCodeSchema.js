const mongoose = require("mongoose");

const qrCodeSchema = new mongoose.Schema(
  {
    transaction_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transactions",
      required: true,
    },
    qr_code: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("qrCode", qrCodeSchema);
