const express = require('express');
const router = express.Router();

const {
    transferUSDSC,
    checkEmailAndSendOTP,
    verifyOtp,
    checkLastClaim
} = require('../Controller/TestnetUSDSCController');

router.post('/testnet-usdsc/email', checkEmailAndSendOTP);
router.post('/testnet-usdsc/otp', verifyOtp);
router.put("/testnet-usdsc/transfer-usdsc", transferUSDSC);
router.get('/testnet-usdsc/check-lastclaim/:email', checkLastClaim);

module.exports = router;