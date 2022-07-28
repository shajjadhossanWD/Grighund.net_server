const express = require("express");
const router = express.Router();

const { getMyVirtualWallet, deductFromVirtualWallet, topupVirtualWallet } = require("../Controller/VirtualWalletController");

const auth = require("../Middleware/AuthMiddleware");


router.get("/virtual-wallet/my", auth, getMyVirtualWallet);
router.post("/virtual-wallet/deduct", auth, deductFromVirtualWallet);
router.put("/virtual-wallet/topup", auth, topupVirtualWallet);


module.exports = router;
