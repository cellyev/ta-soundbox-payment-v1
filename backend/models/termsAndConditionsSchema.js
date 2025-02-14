const mongoose = require("mongoose");

const termsAndConditionsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      unique: true,
      trim: true,
      minlength: [5, "Title must be at least 5 characters long"],
    },
    text: {
      type: String,
      required: [true, "Text is required"],
      trim: true,
      minlength: [10, "Text must be at least 10 characters long"],
    },
    no: {
      type: Number,
      required: [true, "Number is required"],
      unique: true,
      index: true,
    },
    deleted_At: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TermsAndConditions", termsAndConditionsSchema);
