const express = require("express");
const {
  createTransaction,
  paying,
  getById,
} = require("../controllers/transactionController");
const router = express.Router();

router.post("/create-transaction", createTransaction);
router.post("/paying/:transaction_id", paying);

router.get("/get-by-id/:transaction_id", getById);

module.exports = router;
