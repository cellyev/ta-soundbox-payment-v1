const Transactions = require("../models/transactionSchema");

// findTransactionById.js
const findTransactionById = async (transactionId) => {
  try {
    const transaction = await Transactions.findById(transactionId);
    return transaction;
  } catch (err) {
    console.error("Error finding transaction by ID:", err);
    throw err;
  }
};

module.exports = { findTransactionById };
