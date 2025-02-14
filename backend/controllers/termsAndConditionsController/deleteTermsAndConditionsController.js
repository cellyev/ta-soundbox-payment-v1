const TermsAndConditions = require("../../models/termsAndConditionsSchema");
const mongoose = require("mongoose");

exports.deleteTermsAndConditions = async (req, res) => {
  const { _id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(404).json({
        success: false,
        message: "Terms and conditions not found!",
        data: null,
      });
    }

    const existingTermsAndConditions = await TermsAndConditions.findById(_id);
    if (!existingTermsAndConditions) {
      return res.status(404).json({
        success: false,
        message: "Terms and conditions not found!",
        data: null,
      });
    }

    await existingTermsAndConditions.deleteOne({ _id });

    return res.status(200).json({
      success: true,
      message: "Terms and Conditions deleted successfully!",
      data: null,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "An internal server error occurred!",
      data: null,
    });
  }
};
