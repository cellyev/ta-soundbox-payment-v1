const axios = require("axios");
const Transactions = require("../../models/transactionSchema");
const TransactionItems = require("../../models/transactionItemSchema");
const mongoose = require("mongoose");

exports.getById = async (req, res) => {
  const { transaction_id } = req.params;

  try {
    if (!transaction_id || !mongoose.Types.ObjectId.isValid(transaction_id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing Transaction ID",
        data: null,
      });
    }

    const existingTransaction = await Transactions.findById(transaction_id);

    if (!existingTransaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
        data: null,
      });
    }

    // if (["completed", "cancelled"].includes(existingTransaction.status)) {
    //   return res.status(400).json({
    //     success: false,
    //     message: `Transaction is already ${existingTransaction.status}`,
    //     data: null,
    //   });
    // }
    const existingTransactionItems = await TransactionItems.find({
      transaction_id,
    });

    if (!existingTransactionItems) {
      return res.status(404).json({
        success: false,
        message: "Transaction items not found",
        data: null,
      });
    }

    const vailovent_id = `VAILOVENT-${transaction_id}`;
    // console.log("Generated Vailovent ID:", vailovent_id);

    const midtransUrl =
      "https://payment.evognito.my.id/midtrans/get-data?param=VAILOVENT";

    const response = await axios.get(midtransUrl);

    // console.log("Midtrans Response:", JSON.stringify(response.data, null, 2));

    if (!response.data || !response.data.data) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch transaction data from Midtrans",
        data: null,
      });
    }

    let midtransData = response.data.data;

    if (!Array.isArray(midtransData) && midtransData.transactions) {
      midtransData = midtransData.transactions;
    }

    if (!Array.isArray(midtransData)) {
      return res.status(500).json({
        success: false,
        message: "Invalid data format received from Midtrans",
        data: null,
      });
    }

    // Debugging: Cetak semua order_id dari API
    // midtransData.forEach((item) =>
    //   console.log("Order ID dari API:", item.order_id)
    // );

    // Filter data dengan order_id yang sesuai
    const filteredData = midtransData.filter(
      (item) => item.order_id === vailovent_id
    );

    // console.log("Filtered Data:", filteredData);

    // Ambil satu transaksi saja (jika ada lebih dari satu)
    const selectedTransaction =
      filteredData.length > 0 ? filteredData[0] : null;

    return res.status(200).json({
      success: true,
      message: selectedTransaction
        ? "Matching transaction found"
        : "No matching transaction found in Midtrans",
      data: {
        transaction: existingTransaction,
        transactionItems: existingTransactionItems,
        midtransData: selectedTransaction, // Ambil satu transaksi saja
      },
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
