const router = require("express").Router();

const {
    SendEmailOtp,
    SendMobileOtp,
    verifyEmailOTP,
    verifyMobileOTP,
    saveWalletAddress,
    getAllData,

} = require("../Controller/ChallengesController");

router.post('/challenges/sendEmailOtp', SendEmailOtp);
router.post('/challenges/phone', SendMobileOtp);
router.put('/challenges/emailVerify/:walletAddress', verifyEmailOTP);
router.put('/challenges/phoneVerify/:walletAddress', verifyMobileOTP);
router.put('/challenges/walletAddress/:walletAddress', saveWalletAddress);
router.get('/challenges/walletAddress/:walletAddress', getAllData);

module.exports = router;
