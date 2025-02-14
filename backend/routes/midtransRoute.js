const express = require("express");
const {
  createTransactionMidtrans,
} = require("../controllers/midtransControllers/createTransactionMidtrans");

const route = express.Router();

route.post("/create-transaction", createTransactionMidtrans);

module.exports = route;
