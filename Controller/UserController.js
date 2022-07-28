// const User = require("../Schema/userSchema");
const User = require("../Models/UserModel");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const VirtualWallet = require("../Models/VirtualWalletModel");
const ReferralTransaction = require("../Models/ReferralTransactionModel");
const Transaction = require('../Models/TransactionModel');

const generateReferralCode = async () => {
    let referralCode = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 6; i++) {
        referralCode += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    const user = await User.findOne({ myReferralCode: referralCode });
    if (user) {
        return generateReferralCode();
    }
    return referralCode.toUpperCase();
};

exports.findOrCreateUser = async (req, res) => {
    try {
        const user = await User.findOne({ walletAddress: req.body.walletAddress });
        if (user) {
            // make jwt token
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: "7d",
            });

            const transaction = new Transaction({
                type: "Login",
                user: user._id,
                url: null,
            });
            await transaction.save();

            return res.status(200).json({
                token,
                user,
            })
        }
        else {
            const refCode = await generateReferralCode();
            const newUser = new User({
                walletAddress: req.body.walletAddress,
                referralID: req.body?.referralID ? req.body.referralID : null,
                myReferralCode: refCode,
            });
            const data = await newUser.save();

            const virtualWallet = new VirtualWallet({
                user: data._id,
                usdsc: "0.00",
                dsl: "0.00",
                kai: "0.00",
            });
            await virtualWallet.save();

            // make jwt token
            const token = jwt.sign({ id: data._id }, process.env.JWT_SECRET, {
                expiresIn: "7d",
            });

            res.status(200).json({
                token,
                user: data,
            })
        }
    }
    catch (e) {
        console.error(e.message);
        res.status(500).json({ message: "An error occurred while creating user" });
    }
}

exports.logout = async (req, res) => {
    try {
        const transaction = new Transaction({
            type: "Logout",
            user: req.user._id,
            url: null,
        });
        await transaction.save();

        res.status(200).json({
            message: "Logout successfully",
        });
    }
    catch (e) {
        console.error(e.message);
        res.status(500).json({ message: "An error occurred while logout" });
    }
}

exports.findUserByWalletAddress = async (req, res) => {
    try {
        if (req.user) {
            res.json(req.user);
        }
        else {
            res.status(404).json({ message: "User not found" });
        }
    }
    catch (e) {
        console.error(e.message);
        res.status(500).json({ message: "An error occurred while getting user by wallet address" });
    }
}

exports.updateUser = async (req, res) => {
    try {

        const wallet = await User.findOne({ walletAddress: req.params.walletAddress });

        const username = await User.findOne({ username: req.body.username });

        if (username && wallet.walletAddress !== username.walletAddress) {
            return res.status(400).json({
                message: "Not Available, Please choose another username",
            });
        }
        const email = await User.findOne({ email: req.body.email });

        if (email && wallet.walletAddress !== email.walletAddress && email.isEmailVerified) {
            return res.status(400).json({
                message: "This email already registered",
            });
        }

        if (wallet.username !== req.body.username) {
            if (wallet?.usernameUpdateHistory.length === 3) {
                // check username update is 2 times in a year and show date of next update
                const lastUpdate = new Date(wallet.usernameUpdateHistory[1]);
                const nextUpdate = new Date(lastUpdate.setFullYear(lastUpdate.getFullYear() + 1));
                if (lastUpdate.getDate() <= new Date().getDate()) {
                    return res.status(400).json({
                        message: "Please update your username after " + nextUpdate.getDate() + "/" + (nextUpdate.getMonth() + 1) + "/" + nextUpdate.getFullYear(),
                    });
                }
                if (nextUpdate.getDate() <= new Date().getDate()) {
                    wallet.usernameUpdateHistory = [];
                }
            }
        }

        if (req.body?.referralID) {
            const findReferral = await User.findOne({ myReferralCode: req.body.referralID });
            if (!findReferral) {
                return res.status(400).json({
                    message: "Invalid referral code",
                });
            }
        }

        const query = { walletAddress: req.params.walletAddress };

        let path = "https://backend.grighund.net/assets/" + req.filename;

        const data = {
            name: req.body.name,
            avatar: req.filename && path,
            username: req.body.username,
            email: req.body.email,
            network: req.body.network,
            usernameUpdateHistory: [...wallet.usernameUpdateHistory, new Date()],
            referralID: req.body.referralID ? req.body.referralID : null,
        };

        const options = { upsert: true, new: true };

        const user = await User.findOneAndUpdate(query, data, options);

        let message = "You have successfully saved your profile";

        if (user) {
            if (user.avatar && user.name && user.username && user.email && user.walletAddress && user.isEmailVerified) {
                const exist = await VirtualWallet.findOne({ user: user._id });
                if (exist && !user.profileBonus) {
                    const newUSDSC = parseFloat(exist.usdsc) + parseFloat(10.00)
                    exist.usdsc = newUSDSC.toFixed(2);
                    const newDSL = parseFloat(exist.dsl) + parseFloat(10.00)
                    exist.dsl = newDSL.toFixed(2);
                    await exist.save();
                    user.profileBonus = true;
                    await user.save();
                    message = "You have been rewarded 10.00 USDSC and 10.00 DSL for updating your profile";
                }

                const exist2 = await VirtualWallet.findOne({ user: user._id });
                if (user.referralID && !user.referralBonus) {
                    const newUSDSC = parseFloat(exist2.usdsc) + parseFloat(10.00)
                    exist2.usdsc = newUSDSC.toFixed(2);
                    await exist2.save();

                    const referral = await User.findOne({ myReferralCode: user.referralID });
                    const referralVirtualWallet = await VirtualWallet.findOne({ user: referral._id });
                    if (referralVirtualWallet) {
                        const newUSDSC = parseFloat(referralVirtualWallet.usdsc) + parseFloat(10.00)
                        referralVirtualWallet.usdsc = newUSDSC.toFixed(2);
                        await referralVirtualWallet.save();
                    }

                    const referralTransaction = new ReferralTransaction({
                        user: referral._id,
                        referral: user._id,
                        usdsc: "10.00",
                        type: "Referral Bonus",
                    });
                    await referralTransaction.save();
                }

            }
        }

        res.status(200).json({
            user,
            message: message,
        });
    }
    catch (e) {
        console.error(e.message);
        res.status(500).json("An error occurred while updating user");
    }
}

exports.getUserByUsername = async (req, res) => {
    try {
        const username = await User.findOne({ username: req.params.username });
        if (!username) {
            res.status(200).json({
                message: "Congratulations, Your username is available",
            });
        } else {

            if (req.user.username === username.username) {
                res.status(200).json({
                    message: "You already taken this username",
                });
            } else {
                res.status(409).json({
                    message: "Not Available, Please choose another username",
                });
            }
        }
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: "An error occurred while checking username",
        });
    }
}

const getPin = () => {
    const otp = Math.floor(Math.random() * 10000);
    if (otp.toString().length === 4) {
        return otp;
    }
    else {
        return getPin();
    }
}

exports.emailOtpverification = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user && user.isEmailVerified) {
            return res.status(400).json({
                message: "This email already registered"
            })
        }

        const emailValidation = await axios.get(`https://api.zerobounce.net/v1/validate?apikey=${process.env.ZERO_BOUNCE_API_KEY}&email=${req.body.email}`);
        if (emailValidation.data.status === "Valid") {
            const otp = getPin();
            const data = {
                from: {
                    email: "no-reply@grighund.net",
                },
                to: [
                    {
                        email: req.body.email
                    }
                ],
                subject: "Grighund.net - Your 2FA Code",
                html: `<html>

<head>
    <style>
        @media only screen and (max-width: 620px) {
            table.body h1 {
                font-size: 28px !important;
                margin-bottom: 10px !important;
            }

            table.body p,
            table.body ul,
            table.body ol,
            table.body td,
            table.body span,
            table.body a {
                font-size: 16px !important;
            }

            table.body .wrapper,
            table.body .article {
                padding: 10px !important;
            }

            table.body .content {
                padding: 0 !important;
            }

            table.body .container {
                padding: 0 !important;
                width: 100% !important;
            }

            table.body .main {
                border-left-width: 0 !important;
                border-radius: 0 !important;
                border-right-width: 0 !important;
            }

            table.body .btn table {
                width: 100% !important;
            }

            table.body .btn a {
                width: 100% !important;
            }

            table.body .img-responsive {
                height: auto !important;
                max-width: 100% !important;
                width: auto !important;
            }
        }

        @media all {
            .ExternalClass {
                width: 100%;
            }

            .ExternalClass,
            .ExternalClass p,
            .ExternalClass span,
            .ExternalClass font,
            .ExternalClass td,
            .ExternalClass div {
                line-height: 100%;
            }

            .apple-link a {
                color: inherit !important;
                font-family: inherit !important;
                font-size: inherit !important;
                font-weight: inherit !important;
                line-height: inherit !important;
                text-decoration: none !important;
            }

            #MessageViewBody a {
                color: inherit;
                text-decoration: none;
                font-size: inherit;
                font-family: inherit;
                font-weight: inherit;
                line-height: inherit;
            }

            .btn-primary table td:hover {
                background-color: #34495e !important;
            }

            .btn-primary a:hover {
                background-color: #34495e !important;
                border-color: #34495e !important;
            }
        }
    </style>
</head>
 
<body style="background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f6f6f6; width: 100%;" width="100%" bgcolor="#f6f6f6">
        <tr>
            <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;" valign="top">&nbsp;</td>
            <td class="container" style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; max-width: 580px; padding: 10px; width: 580px; margin: 0 auto;"
                width="580" valign="top">
                <div class="content" style="box-sizing: border-box; display: block; margin: 0 auto; max-width: 580px; padding: 10px;">

                    <!-- START CENTERED WHITE CONTAINER -->
                    <table role="presentation" class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background: #ffffff; border-radius: 3px; width: 100%;" width="100%">
                        <tr>
                            <td style="background-color: #d6d6d6; padding: 4px 0px; width: 100%; text-align: center;">
                                <img src="https://i.ibb.co/NnShKwY/Grighund-2.jpg" alt="logo" border="0"
                                    style="width: 100%; max-width: 100px; height: auto;" width="100">
                            </td>
                        </tr>

                        <!-- START MAIN CONTENT AREA -->
                        <tr>
                            <td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;" valign="top">
                                <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%">
                                    <tr>
                                        <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;"valign="top">
                                            <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;">
                                                Hello,</p>
                                            <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;">This is your OTP.</p>
                                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; box-sizing: border-box; width: 100%;" width="100%">
                                                <tbody>
                                                    <tr>
                                                        <td align="left" style="font-family: sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 15px;"
                                                            valign="top">
                                                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;">
                                                                <tbody>
                                                                    <tr>
                                                                        <td style="font-family: sans-serif; font-size: 14px; vertical-align: top; border-radius: 5px; text-align: center; background-color: #3498db;" valign="top" align="center" bgcolor="#3498db"> 
                                                                            <div style="border: solid 1px #3498db; border-radius: 5px; box-sizing: border-box; cursor: pointer; display: inline-block; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-decoration: none; text-transform: capitalize; background-color: #3498db; border-color: #3498db; color: #ffffff;">
                                                                            ${otp}
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <!-- END MAIN CONTENT AREA -->
                    </table>
                    <!-- END CENTERED WHITE CONTAINER -->
                    <!-- START FOOTER -->
                    <div class="footer" style="clear: both; margin-top: 10px; text-align: center; width: 100%;">
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;"
                            width="100%">
                            <tr>
                                <td class="content-block" style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; color: #999999; font-size: 12px; text-align: center;" valign="top" align="center">
                                    <p class="apple-link" style="color: #999999; font-size: 16px; text-align: center;">
                                        Regards,<br>
                                        Grighund.net <br>
                                        support@grighund.net
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </div>
                    <!-- END FOOTER -->

                </div>

            </td>
            <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;" valign="top">&nbsp;</td>
        </tr>
    </table>
</body>

                    </html>`
            }
            const sendMail = await axios({
                method: "POST",
                url: "https://api.mailersend.com/v1/email",
                data: data,
                headers: {
                    "content-Type": "application/json",
                    "authorization": `Bearer ${process.env.MAILER_SEND_TOKEN}`
                }
            });

            if (sendMail.status === 202) {
                await User.updateOne({ _id: req.user._id }, { otp: otp });

                const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
                    expiresIn: "6h",
                });

                res.status(200).json({
                    token: token,
                    message: "Please check your email for OTP",
                });
            }
            else {
                res.status(400).send("Email not sent");
            }
        } else {
            res.status(400).json({ message: "Email is invalid" });
        }
    }
    catch (e) {
        console.error(e.message);
        res.status(500).json({ message: "An error occurred while logging in" });
    }
}

exports.verifyOTP = async (req, res) => {
    try {

        if (parseInt(req.body.otp) === req.user.otp) {
            await User.findByIdAndUpdate(req.user._id, {
                isEmailVerified: true
            })
            res.status(200).json({
                message: "Otp verified",
            });
        }
        else {
            res.status(400).json({ message: "Invalid OTP!" });
        }
    }
    catch (e) {
        console.error(e.message);
        res.status(500).json({ message: "An error occurred while verifying otp" });
    }
}

exports.registerNFTWallet = async (req, res) => {
    try {
        const update = await User.findByIdAndUpdate(req.user._id, {
            nftRegister: true
        }, { new: true })
        if (update) {
            res.status(200).json({
                user: update,
                message: "Wallet Register success"
            })
        }
    }
    catch (e) {
        console.log(e)
        res.status(500).json({
            message: "An error occurred while Wallet Register"
        })
    }
}