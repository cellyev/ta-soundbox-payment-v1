const express = require("express");
const {
  createTransaction,
} = require("../controllers/transactionController/createTransactionController");
const {
  paying,
} = require("../controllers/transactionController/completePaymentController");
const {
  getById,
} = require("../controllers/transactionController/getTransactionController");

const router = express.Router();

router.post("/create-transaction", createTransaction);
router.post("/paying/:transaction_id/:status", paying);

router.get("/get-by-id/:transaction_id", getById);

module.exports = router;
