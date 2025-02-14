const mongoose = require("mongoose");
const Products = require("../../models/productSchema");

exports.deleteProduct = async (req, res) => {
  const { _id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(404).json({
        success: false,
        message: "Product not found!",
        data: null,
      });
    }

    existingProduct = await Products.findById(_id);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found!",
        data: null,
      });
    }

    await existingProduct.deleteOne({ _id });

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully!",
      data: null,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred!",
      data: null,
    });
  }
};
