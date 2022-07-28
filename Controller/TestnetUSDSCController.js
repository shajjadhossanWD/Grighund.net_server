const TestnetUSDSC = require('../Models/TestnetUSDSCModel');
const axios = require("axios");

const getPin = () => {
    const otp = Math.floor(Math.random() * 10000);
    if (otp.toString().length === 4) {
        return otp;
    }
    else {
        return getPin();
    }
}
exports.checkEmailAndSendOTP = async (req, res) => {
    try {
        const exists = await TestnetUSDSC.findOne({ email: req.body.email });
        if (exists) {
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
                    subject: "Grighund.net - Your Email Verify Code",
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
                    await TestnetUSDSC.updateOne({ email: req.body.email }, { otp: otp });

                    res.status(200).json({
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
        else {
            const otp = getPin();
            const emailValidation = await axios.get(`https://api.zerobounce.net/v1/validate?apikey=${process.env.ZERO_BOUNCE_API_KEY}&email=${req.body.email}`);
            if (emailValidation.data.status === "Valid") {
                const data = {
                    from: {
                        email: "no-reply@grighund.net",
                    },
                    to: [
                        {
                            email: req.body.email
                        }
                    ],
                    subject: "Grighund.net - Your Email Verify Code",
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

                    const newTestnetUSDSC = new TestnetUSDSC({
                        email: req.body.email,
                        otp: otp,
                    });
                    await newTestnetUSDSC.save();

                    res.status(200).json({
                        message: "Please check your email for OTP",
                    });
                }
                else {
                    res.status(400).send("Email not sent");
                }

            }
            else {
                res.status(400).json({ message: "Email is invalid" });
            }
        }
    }
    catch (err) {
        console.log(err)
        res.status(400).json({ message: "An error occurred while send otp" });
    }
}

exports.verifyOtp = async (req, res) => {
    try {
        const data = await TestnetUSDSC.findOne({ email: req.body.email });
        if (data) {
            if (data.otp === req.body.otp) {
                res.status(200).json({ message: "OTP verified" });
            }
            else {
                res.status(400).json({ message: "OTP is invalid" });
            }
        }
        else {
            res.status(400).json({ message: "Email is invalid" });
        }
    }
    catch (err) {
        console.log(err)
        res.status(400).json({ message: "An error occurred while verifying otp" });
    }
}

exports.checkLastClaim = async (req, res) => {
    const exists = await TestnetUSDSC.findOne({
        email: req.params.email
    });

    if (exists) {
        const timeDiff = Math.abs(Date.now() - exists?.lastClaimTime);
        const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        if (diffDays <= 1) {
            return res.status(400).json({
                claims: exists.claims,
                message: "Please wait 24 hours!"
            })
        }
        else {
            return res.status(200).json({
                claims: exists.claims,
                message: "You can claim"
            })
        }
    } else {
        return res.status(200).json({
            claims: 0,
            message: "You can claim"
        })
    }
}

exports.transferUSDSC = async (req, res) => {
    try {
        // check address createAt time pass 24 hour
        const exists = await TestnetUSDSC.findOne({
            email: req.body.email
        });

        if (exists) {
            // update time and claims
            await TestnetUSDSC.updateOne({
                email: req.body.email
            }, {
                $set: {
                    address: req.body.address,
                    lastClaimTime: Date.now(),
                    claims: exists.claims + 1
                }
            });

            return res.status(200).json({
                claims: exists.claims + 1,
                message: "Your address is updated successfully!",
            })

        } else {
            const checkNewAddress = await TestnetUSDSC.findOne({
                email: req.body.email
            });
            if (checkNewAddress && checkNewAddress.address === null) {
                // update time and claims
                await TestnetUSDSC.updateOne({
                    email: req.body.email
                }, {
                    $set: {
                        address: req.body.address,
                        claims: 1,
                        lastClaimTime: Date.now()
                    }
                });

                return res.status(200).json({
                    claims: 1,
                    message: "Your address is updated successfully!",
                })
            }
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "An error occurred while checking and transferring usdsc",
        });
    }
}