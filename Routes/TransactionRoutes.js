const express = require("express");
const router = express.Router();

const { getMyTransaction, getAllTransaction } = require("../Controller/TransactionController");
const { getReferralTransaction } = require("../Controller/ReferralTransactionController");

const auth = require("../Middleware/AuthMiddleware");

router.get("/transactions/my", auth, getMyTransaction);
router.get("/transactions/", getAllTransaction);
router.get("/transactions/referral/:id", getReferralTransaction);

module.exports = router;
