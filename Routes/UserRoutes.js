const express = require("express");
const router = express.Router();

const {
    findOrCreateUser,
    findUserByWalletAddress,
    updateUser,
    emailOtpverification,
    verifyOTP,
    getUserByUsername,
    registerNFTWallet,
    logout
} = require("../Controller/UserController");

const upload = require("../Middleware/Upload");
const auth = require("../Middleware/AuthMiddleware");

router.post("/users/logout", auth, logout);
router.post("/users/emailVerification", auth, emailOtpverification);
router.post("/users/verifyOtp", auth, verifyOTP);
router.put("/users/nft/register", auth, registerNFTWallet)
router.get("/users/username/:username", auth, getUserByUsername);

router.post("/users/", findOrCreateUser);
router.get("/users/:walletAddress", auth, findUserByWalletAddress);
router.put("/users/:walletAddress", upload.single("image"), updateUser);

module.exports = router;
