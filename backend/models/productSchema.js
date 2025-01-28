const mongoose = require("mongoose");
const validator = require("validator");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required!"],
      trim: true,
      minlength: [3, "Product name must be at least 3 characters long!"],
    },
    description: {
      type: String,
      required: [true, "Description is required!"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters long!"],
    },
    stock: {
      type: Number,
      required: true,
      enum: [0, 1],
      default: 1,
    },
    price: {
      type: Number,
      required: [true, "Price is required!"],
      min: [0, "Price cannot be negative!"],
      validate: {
        validator: function (value) {
          return validator.isFloat(String(value), { min: 0 });
        },
        message: "Price must be a valid number!",
      },
    },
    image: {
      type: String,
      required: [true, "Image URL is required!"],
      validate: {
        validator: function (value) {
          return validator.isURL(value, { protocols: ["http", "https"] });
        },
        message: "Invalid image URL!",
      },
    },
  },
  { timestamps: true }
);

// Pre-save hook to capitalize product name
productSchema.pre("save", function (next) {
  if (this.name && this.name.length > 0) {
    this.name = this.name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }
  next();
});

module.exports = mongoose.model("Products", productSchema);
