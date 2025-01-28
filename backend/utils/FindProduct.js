const Products = require("../models/productSchema");

exports.findProductById = async (_id) => {
  const result = await Products.findById({ _id });
  return result;
};

exports.findProductByEmail = async (email) => {
  const result = await Products.findOne({ email });
  return result;
};

exports.findProductByName = async (name) => {
  const result = await Products.findOne({ name });
  return result;
};

exports.findProductByDescription = async (description) => {
  const result = await Products.findOne({ description });
  return result;
};

exports.findProductByPrice = async (price) => {
  const result = await Products.findOne({ price });
  return result;
};

exports.findProductByImage = async (image) => {
  const result = await Products.findOne({ image });
  return result;
};
