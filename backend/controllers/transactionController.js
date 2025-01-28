const mongoose = require("mongoose");

const Transactions = require("../models/transactionSchema");
const TransactionItems = require("../models/transactionItemSchema");
const { findProductById } = require("../utils/FindProduct");
const {
  payingValidator,
  createTransactionValidator,
} = require("../middlewares/transactionValidator");
const { sendVerificationEmail } = require("../middlewares/sendMail");

const { generateQRCode } = require("../utils/qrCodeGenerator");
const QRCode = require("../models/qrCodeSchema");
const { findTransactionById } = require("../utils/findTransaction");

const PAYMENT_URL = `${process.env.CLIENT_URL}/paying`;

exports.createTransaction = async (req, res) => {
  const { table_code, customer_name, customer_email, products } = req.body;

  try {
    const { error, value } = createTransactionValidator.validate({
      table_code,
      customer_name,
      customer_email,
      products,
    });

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      return res.status(400).json({
        success: false,
        message: errorMessages,
      });
    }

    const existingTransaction = await Transactions.findOne({ table_code });
    if (existingTransaction) {
      const isTransactionInProgress =
        existingTransaction.createdAt.getTime() + 600000 > Date.now() &&
        existingTransaction.status !== "completed";
      if (isTransactionInProgress) {
        return res.status(400).json({
          success: false,
          message:
            "A transaction is already in progress for this table. Please complete the current transaction before starting a new one.",
        });
      }
    }

    let total_amount = 0;
    const transactionItems = [];

    for (const product of products) {
      const productData = await findProductById(product.product_id);
      if (!productData) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${product.product_id} not found`,
        });
      }
      const amount = product.qty * productData.price;
      total_amount += amount;

      transactionItems.push(
        new TransactionItems({
          transaction_id: null,
          product_id: product.product_id,
          product_name: productData.name,
          qty: product.qty,
          amount,
        })
      );
    }

    const transaction = new Transactions({
      table_code,
      customer_name,
      customer_email,
      total_amount,
    });

    const savedTransaction = await transaction.save();

    const updatedTransactionItems = transactionItems.map((item) => {
      item.transaction_id = savedTransaction._id;
      return item;
    });

    await TransactionItems.insertMany(updatedTransactionItems);

    const qrData = `${PAYMENT_URL}/${savedTransaction._id}`;
    const qrCode = await generateQRCode(qrData);

    const qrCodeEntry = new QRCode({
      transaction_id: savedTransaction._id,
      qr_code: qrCode,
    });
    await qrCodeEntry.save();

    res.status(201).json({
      success: true,
      message: "Transaction created successfully",
      data: { savedTransaction, qrCode },
    });
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({
      success: false,
      message: "An internal server error occurred!",
    });
  }
};

exports.paying = async (req, res) => {
  const { transaction_id } = req.params;
  const { amount } = req.body;

  try {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) {
      return res.status(400).json({
        success: false,
        message: "Amount must be a valid number!",
      });
    }

    const { error, value } = payingValidator.validate({
      amount,
    });

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      return res.status(400).json({
        success: false,
        message: errorMessages,
      });
    }

    const existingTransaction = await Transactions.findById(transaction_id);
    if (!existingTransaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found!",
        data: null,
      });
    }

    if (existingTransaction.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Transaction has already been completed!",
        data: null,
      });
    }

    if (existingTransaction.createdAt.getTime() + 600000 < Date.now()) {
      return res.status(400).json({
        error: "Transaction expired",
        message:
          "The transaction has exceeded the 10-minute payment window. Please create a new transaction.",
      });
    }

    const validAmount = parseFloat(existingTransaction.total_amount);
    if (parseFloat(amount) !== validAmount) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount!",
        data: null,
      });
    }

    existingTransaction.status = "completed";
    const result = await existingTransaction.save();
    const items = await TransactionItems.find({
      transaction_id: transaction_id,
    });

    await sendVerificationEmail(
      existingTransaction.customer_email,
      existingTransaction,
      items
    );

    return res.status(200).json({
      success: true,
      message: "Transaction completed successfully!",
      data: result,
      items: items,
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

exports.getById = async (req, res) => {
  try {
    const { transaction_id } = req.params; // Ambil transaction_id dari params

    // Validasi jika transaction_id kosong atau bukan ObjectId yang valid
    if (!transaction_id || !mongoose.Types.ObjectId.isValid(transaction_id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing Transaction ID",
        data: null,
      });
    }

    // Cari transaksi di database
    const existingTransaction = await findTransactionById(transaction_id);

    if (!existingTransaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
        data: null,
      });
    }

    // Periksa status transaksi
    if (existingTransaction.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Transaction is already completed",
        data: null,
      });
    }

    if (existingTransaction.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Transaction is already cancelled",
        data: null,
      });
    }

    // Kirimkan detail transaksi jika valid
    return res.status(200).json({
      success: true,
      message: "Transaction is being processed",
      data: existingTransaction,
    });
  } catch (error) {
    console.error("Error in getById:", error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred",
      data: null,
    });
  }
};
