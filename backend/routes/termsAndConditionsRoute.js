const express = require("express");
const {
  getTermsAndConditions,
} = require("../controllers/termsAndConditionsController/getTermsAndConditionsController");
const {
  createTermsAndConditions,
} = require("../controllers/termsAndConditionsController/createTermsAndConditionsController");
const {
  updateTermsAndConditions,
} = require("../controllers/termsAndConditionsController/updateTermsAndConditionsController");
const {
  deleteTermsAndConditions,
} = require("../controllers/termsAndConditionsController/deleteTermsAndConditionsController");

const router = express.Router();

router.get("/", getTermsAndConditions);
router.post("/create", createTermsAndConditions);
router.put("/update/:_id", updateTermsAndConditions);
router.delete("/delete/:_id", deleteTermsAndConditions);

module.exports = router;
