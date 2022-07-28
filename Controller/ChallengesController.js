const axios = require("axios");
// const challenge = require('../Schema/challengesSchema');
const challenge = require('../Models/ChallengesModel');


const getPin = () => {
    const otp = Math.floor(Math.random() * 10000);
    if (otp.toString().length === 4) {
        return otp;
    }
    else {
        return getPin();
    }
}

exports.SendEmailOtp = async (req, res) => {
    const userEmail = await challenge.findOne({ email: req.body.email });

    if (userEmail && userEmail.emailVerify === true) {
        return res.status(400).json("This Email is already exists")
    }
    const emailValidation = await axios.get(`https://api.zerobounce.net/v1/validate?apikey=${process.env.ZERO_BOUNCE_API_KEY}&email=${req.body.email}`);

    if (emailValidation.data.status === "Valid") {
        const otp = getPin();
        const data = {
            from: {
                email: "no-reply@grighund.net"
            },
            to: [
                {
                    email: req.body.email
                }
            ],
            subject: "Grighund.net Email varification OTP",
            text: `Your OTP is ${otp}`
        }



        const sendMail = await axios({
            method: "POST",
            url: "https://api.mailersend.com/v1/email",
            data: data,
            headers: {
                "content-Type": "application/json",
                "authorization": `Bearer ${process.env.MAILER_SEND_TOKEN}`
            }
        })

        const walletAddress = await challenge.findOne({ walletAddress: req.body.walletAddress })


        if (sendMail.status === 202) {
            if (walletAddress && walletAddress.emailVerify === false) {
                await challenge.findOneAndUpdate({
                    walletAddress: walletAddress,
                }, {
                    otp: otp,
                })

            } else {
                await challenge.create({
                    otp: otp,
                    email: req.body.email,
                    walletAddress: req.body.walletAddress,
                });
            }
            res.status(200).json({
                message: "Please check your email for OTP ",
            });
        } else {
            res.status(400).json({ message: "Email not sent" });
        }
    } else {
        res.status(400).json({ message: "Email is invalid" })
    }
}

exports.verifyEmailOTP = async (req, res) => {

    try {
        const walletAddress = await challenge.findOne({ walletAddress: req.body.walletAddress });
        if (!walletAddress) {
            return res.status(400).json({
                message: ' walletAddress not exists please complete next step'
            });
        }

        // console.log(walletAddress.otp)
        // console.log(req.body.otp)

        // if(walletAddress.otp != parseInt(req.body.otp)){
        //     return res.status(400).json({
        //         message: "Invalid OTP please enter right otp"
        //     })
        // }
        await challenge.findOneAndUpdate({
            walletAddress: walletAddress,
        }, {
            emailValidation: true,
            point: 33.34,
        })

        res.status(200).json({
            message: "Email verify successfully completed",
        });
    }
    catch (e) {
        console.error(e.message);
        res.status(500).json({ message: "An error occurred while verifying otp" });
    }
}


// phone ========================================================

exports.SendMobileOtp = async (req, res) => {
    const userPhone = await challenge.findOne({ phone: req.body.phone });

    if (userPhone && userPhone.phoneVerify === true) {
        return res.status(400).json("This phone number is already exists")
    }

    const otp = getPin();
    const form = new URLSearchParams();
    form.append('number', req.body.phone)
    form.append('sms', `Hey thankyou for accepting challenge your otp code is ${otp}`)
    form.append('token_key', 'A127D6152289454BF33211DFD5CBD')

    const sendSms = await axios.post('https://dslegends.org/api/send-sms',
        form,
        {
            headers: {
                "PHPSESSID": "fthsp6q6b7ddmibtj0shc6ad4r",
            }
        })

    if (sendSms.data.success === true) {
        await challenge.findOneAndUpdate({
            walletAddress: req.body.walletAddress,
        }, {
            phone: req.body.phone,
            otp: otp,
        })
        res.status(200).json({
            message: "Please check your phone for OTP ",
        });
    } else {
        res.status(400).json({ message: "phone number is not valid" });
    }

}

exports.verifyMobileOTP = async (req, res) => {

    try {
        const walletAddress = await challenge.findOne({ walletAddress: req.params.walletAddress });

        if (walletAddress.phoneVerify) {
            return res.status(400).json({
                message: 'Your phone number already verified please go next step'
            });
        }

        if (walletAddress.otp != req.body.otpPhone) {
            return res.status(400).json({
                message: "Invalid OTP please enter right otp"
            })
        }

        await challenge.findByIdAndUpdate(walletAddress._id, {
            phoneVerify: true,
            point: 66.67,
        });

        res.status(200).json({
            message: "Phone verify successfully completed",
        });
    }
    catch (e) {
        console.error(e.message);
        res.status(500).json({ message: "An error occurred while verifying otp" });
    }
}


// walletAddress---==============================

exports.saveWalletAddress = async (req, res) => {

    try {
        const walletAddress = await challenge.findOne({ walletAddress: req.body.walletAddress });
        if (walletAddress) {
            return res.status(400).json({
                message: 'wallet address already exists please complete next step'
            });
        }

        await challenge.findByIdAndUpdate({
            walletAddress: walletAddress,
        }, {
            point: 100,
        });

        res.status(200).json({
            message: "WalletAddress successfully added",
        });
    }
    catch (e) {
        console.error(e.message);
        res.status(500).json({ message: "An error occurred while verifying otp" });
    }
}

// getallData ============================
exports.getAllData = async (req, res) => {
    try {
        const walletAddress = await challenge.find({ walletAddress: req.body.walletAddress });
        res.status(200).json({
            message: "Get all data successfully",
            point: walletAddress.point,
        });
    }
    catch (e) {
        res.status(500).json({
            message: "An error occurred while get all admin",
        });
    }
}