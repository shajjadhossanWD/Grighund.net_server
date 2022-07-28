// const User = require('../Schema/AdminSchema');
const User = require('../Models/AdminModel');
const jwt = require('jsonwebtoken')
const axios = require('axios');

exports.addNewAdmin = async (req, res) => {
    try {
        //check req user is admin
        const admin = await User.findById(req.user._id);
        if (admin.role !== "admin") {
            return res.status(400).json({
                message: 'You are admin'
            });
        }

        // check username is already exist
        const user = await User.findOne({ username: req.body.username });
        if (user) {
            return res.status(400).json({
                message: 'Username already exist'
            });
        }

        // check email is already exist
        const email = await User.findOne({ email: req.body.email });
        if (email) {
            return res.status(400).json({
                message: 'email already exist'
            });
        }

        let path = "https://backend.grighund.net/assets/" + req.filename;
        const newAdmin = new User({
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            phone: req.body.phone,
            avatar: req.filename && path,
            role: "admin"
        })
        await newAdmin.save();
        res.status(200).json({
            message: "Admin added successfully",
        });
    }
    catch (e) {
        console.log(e);
    }
}


exports.getAllAdmin = async (req, res) => {
    try {
        const admin = await User.find({ role: "admin" });
        res.status(200).json({
            message: "Get all admin successfully",
            admin
        });
    }
    catch (e) {
        res.status(500).json({
            message: "An error occurred while get all admin",
        });
    }
}

exports.getAdminById = async (req, res) => {
    try {
        const admin = await User.findById(req.params.id);
        res.status(200).json({
            message: "Get admin successfully",
            admin
        });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({
            message: "An error occurred while get admin",
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

exports.changeAdminStatus = async (req, res) => {
    try {
        //check req user is admin
        const request = await User.findById(req.user._id);
        if (request.role !== "admin") {
            return res.status(400).json({
                message: 'You are not admin'
            });
        }

        const admin = await User.findById(req.params.id);
        const result = await User.findByIdAndUpdate(req.params.id, { active: !admin.active }, { new: true });
        if (result) {
            res.status(200).json({
                message: "Admin status changed successfully",
            });
        }
    }
    catch (e) {
        res.status(500).json({
            message: "An error occurred while change admin status",
        });
    }
}

exports.deleteAdmin = async (req, res) => {
    try {
        //check req user is admin
        const request = await User.findById(req.user._id);
        if (request.role !== "admin") {
            return res.status(400).json({
                message: 'You are not admin'
            });
        }
        const admin = await User.findById(req.params.id);

        await admin.remove();
        res.status(200).json({
            message: "Admin deleted successfully",
        });
    }
    catch (e) {
        res.status(500).json({
            message: "An error occurred while delete admin",
        });
    }
}

exports.loginAdmin = async (req, res) => {
    try {
        const admin = await User.findOne({ email: req.body.email });
        if (!admin) {
            return res.status(400).json({
                message: "Email is not exist"
            });
        }
        const isMatch = await admin.matchPassword(req.body.password);
        if (!isMatch) {
            return res.status(400).json({
                message: "Password is not correct"
            });
        }
        if (!admin.active) {
            return res.status(400).json({
                message: "Admin is not active"
            });
        }

        const otp = getPin();

        // const emailValidation = await axios.get(`https://api.zerobounce.net/v1/validate?apikey=${process.env.ZERO_BOUNCE_API_KEY}&email=${req.body.email}`);
        // if (emailValidation.data.status === "Valid") {
        const data = {
            from: {
                email: "support@grighund.net",
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
                                                Hello ${admin.name},</p>
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
            await User.updateOne({ _id: admin._id }, { otp: otp });

            const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
                expiresIn: "24h",
            });

            res.status(200).json({
                token: token,
                message: "Please check your email for OTP",
            });
        }
        else {
            res.status(400).send("Email not sent");
        }
        // } else {
        //     res.status(400).json({ message: "Email is invalid" });
        // }
    }
    catch (e) {
        console.error(e.message);
        res.status(500).json({ message: "An error occurred while logging in" });
    }
}

//verify otp
exports.verifyOTP = async (req, res) => {
    try {
        if (parseInt(req.body.otp) === req.user.otp) {
            const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
                expiresIn: "7d",
            });

            res.status(200).json({
                token: token,
                admin: {
                    _id: req.user._id,
                    name: req.user.name,
                    email: req.user.email,
                    mobile: req.user.mobile,
                    role: req.user.role,
                    avatar: req.user.avatar,
                },
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



exports.getCurrentAdmin = async (req, res) => {
    try {
        const admin = await User.findById(req.user._id).select("-password");
        if (!admin.active) {
            return res.status(400).json({
                message: "Admin is not active"
            });
        }
        res.status(200).json({
            message: "Get admin successfully",
            admin
        });
    }
    catch (e) {
        res.status(500).json({
            message: "An error occurred while get admin",
        });
    }
}

exports.sendResetPasswordEmail = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({
                message: "Email is not exist"
            });
        }
        if (user.role !== "admin") {
            return res.status(400).json({
                message: "Your email is not admin"
            });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        const url = `http://localhost:3000/admin/reset-password/${token}`;

        // const emailValidation = await axios.get(`https://api.zerobounce.net/v1/validate?apikey=${process.env.ZERO_BOUNCE_API_KEY}&email=${req.body.email}`);
        // if (emailValidation.data.status === "Valid") {

        const data = {
            from: {
                email: "support@grighund.net",
            },
            to: [
                {
                    email: req.body.email
                }
            ],
            subject: "Grighund.net - Password Reset Link",
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
                                                Hello ${user.name},</p>
                                            <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;">
                                                You recently requested to reset your password for your Grighound.net account. Please click the button below to reset it.
                                            </p>
                                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; box-sizing: border-box; width: 100%;" width="100%">
                                                <tbody>
                                                    <tr>
                                                        <td align="left" style="font-family: sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 15px;"
                                                            valign="top">
                                                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;">
                                                                <tbody>
                                                                    <tr>
                                                                        <td style="font-family: sans-serif; font-size: 14px; vertical-align: top; border-radius: 5px; text-align: center; background-color: #3498db;" valign="top" align="center" bgcolor="#3498db"> 
                                                                            <a href=${url} target="_blank" style="border: solid 1px #3498db; border-radius: 5px; box-sizing: border-box; cursor: pointer; display: inline-block; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-decoration: none; text-transform: capitalize; background-color: #3498db; border-color: #3498db; color: #ffffff;">
                                                                            Reset Password
                                                                            </a>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                             <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;">
                                                Or
                                            </p>
                                            <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;">
                                                Copy and paste the following link into your browser:
                                            </p>
                                            <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;">
                                                <a href=${url}>${url}</a> 
                                            </p>
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
                                        DSDPT.COM Team <br>
                                        support@dsdpt.com
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
            res.status(200).json(
                { message: "Please check your email to reset your password" }
            )
        }
        else {
            res.status(400).send("Email not sent");
        }
        // }
    } catch (e) {
        console.error(e.message);
        res.status(500).json("An error occurred while sending your reset password email");
    }
}

exports.resetPassword = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(400).json({ message: "No user found" });
        }


        user.password = req.body.password;
        await user.save();
        res.status(200).json({ message: "Password reset successfully" });

    } catch (e) {
        console.error(e.message);
        res.status(500).json("An error occurred while validating your reset password token");
    }
}

exports.updateAdminProfile = async (req, res) => {
    try {
        const admin = await User.findById(req.params.id).select('-password');
        if (req.body.name) {
            admin.name = req.body.name;
        }

        if (req.body.username) {
            admin.username = req.body.username;
        }

        if (req.body.email) {
            admin.email = req.body.email;
        }

        if (req.body.phone) {
            admin.phone = req.body.phone
        }

        let path = "https://backend.grighund.net/assets/" + req.filename;

        if (req.filename) {
            admin.avatar = path
        }

        if (req.body.currentPassword && req.body.newPassword) {
            const getAdmin = await User.findById(req.params.id);
            const isMatch = await getAdmin.matchPassword(req.body.currentPassword);
            if (isMatch) {
                admin.password = req.body.newPassword;
            } else {
                return res.status(400).json({ message: "Current password is incorrect" });
            }
        }

        const update = await admin.save();

        if (update) {
            res.status(200).json({
                message: "Updated Successfully",
                admin: {
                    _id: update._id,
                    name: update.name,
                    username: update.username,
                    email: update.email,
                    phone: update.phone,
                    avatar: update.avatar,
                    role: update.role,
                },
            })
        }

    }
    catch (e) {
        console.log(e)
        res.status(500).json({
            message: "An error occurred while updating your profile",
        });
    }
}

exports.updateAllAdminProfile = async (req, res) => {
    try {
        const admin = await User.findById(req.params.id);
        if (req.body.name) {
            admin.name = req.body.name;
        }

        if (req.body.username) {
            admin.username = req.body.username;
        }

        if (req.body.email) {
            admin.email = req.body.email;
        }

        if (req.body.phone) {
            admin.phone = req.body.phone
        }

        let path = "https://backend.grighund.net/assets/" + req.filename;

        if (req.filename) {
            admin.avatar = path
        }

        if (req.body.currentPassword && req.body.newPassword) {
            const getAdmin = await User.findById(req.params.id);
            const isMatch = await getAdmin.matchPassword(req.body.currentPassword);
            if (isMatch) {
                admin.password = req.body.newPassword;
            } else {
                return res.status(400).json({ message: "Current password is incorrect" });
            }
        }

        const update = await admin.save();

        if (update) {
            res.status(200).json({
                message: "Updated successfully",
                admin: {
                    _id: update._id,
                    name: update.name,
                    username: update.username,
                    email: update.email,
                    phone: update.phone,
                    avatar: update.avatar,
                    role: update.role,
                },
            })
        }

    }
    catch (e) {
        console.log(e)
        res.status(500).json({
            message: "An error occurred while updating your profile",
        });
    }
}