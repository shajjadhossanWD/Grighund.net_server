const express = require('express');
const router = express.Router();

const {
    addTransferOutNFT,
    getTransferOutsNFT
} = require('../Controller/TransferOutController');

const auth = require('../Middleware/AuthMiddleware');

router.post('/transfer-out/add-transfer-out-nft', auth, addTransferOutNFT);
router.get('/transfer-out/get-transfer-out-nfts', auth, getTransferOutsNFT);

module.exports = router;