const {
  createProductValidator,
  updateProductValidator,
} = require("../middlewares/productValidator");
const Products = require("../models/productSchema");
const {
  findProductByName,
  findProductByImage,
  findProductById,
} = require("../utils/FindProduct");
const mongoose = require("mongoose");

exports.getAllProducts = async (req, res) => {
  try {
    let { page, limit } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const skip = (page - 1) * limit;

    const allProducts = await Products.find({}).skip(skip).limit(limit);

    const totalProducts = await Products.countDocuments();

    if (allProducts.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found!",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Products retrieved successfully!",
      count: allProducts.length,
      total: totalProducts,
      page: page,
      totalPages: Math.ceil(totalProducts / limit),
      data: allProducts,
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

exports.createProduct = async (req, res) => {
  const { name, description, stock, price, image } = req.body;

  try {
    const { error, value } = createProductValidator.validate({
      name,
      description,
      stock,
      price,
      image,
    });

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      return res.status(400).json({
        success: false,
        message: errorMessages,
      });
    }

    // Validate product name cannot be same
    const existingProductByName = await findProductByName(name);
    if (existingProductByName) {
      return res.status(400).json({
        success: false,
        message: "Product already exists!",
        data: existingProductByName,
      });
    }
    // Validate product image cannot be same
    const existingProductByImage = await findProductByImage(image);
    if (existingProductByImage) {
      return res.status(400).json({
        success: false,
        message: "Product image already exists!",
        data: existingProductByImage,
      });
    }

    const product = new Products({
      name,
      description,
      stock,
      price,
      image,
    });

    const result = await product.save();

    return res.status(201).json({
      success: true,
      message: "Product created successfully!",
      data: result,
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

exports.updateProduct = async (req, res) => {
  const { name, description, stock, price, image } = req.body;
  const { _id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(404).json({
        success: false,
        message: "Product not found!",
        data: null,
      });
    }

    const existingProduct = await findProductById(_id);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found!",
        data: null,
      });
    }

    const { error, value } = updateProductValidator.validate({
      name,
      description,
      stock,
      price,
      image,
    });

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      return res.status(400).json({
        success: false,
        message: errorMessages,
      });
    }

    const verifiedName = await findProductByName(name);
    if (verifiedName && verifiedName._id != _id) {
      return res.status(400).json({
        success: false,
        message: "Product with this name already exists!",
        data: null,
      });
    }

    const verifiedImage = await findProductByImage(image);
    if (verifiedImage && verifiedImage._id != _id) {
      return res.status(400).json({
        success: false,
        message: "Product with this image already exists!",
        data: null,
      });
    }

    existingProduct.name = name;
    existingProduct.description = description;
    existingProduct.stock = stock;
    existingProduct.price = price;
    existingProduct.image = image;

    const result = await existingProduct.save();

    return res.status(201).json({
      success: true,
      message: "Product updated successfully!",
      data: result,
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

    existingProduct = await products.findById(_id);
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
