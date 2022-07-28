const mongoose = require('mongoose');

const challengesSchema = mongoose.Schema({
    email: {
        type: String,
    },
    otp: {
        type: Number,
    },
    phone: {
        type: String,
    },
    walletAddress: {
        type: String,
    },
    emailVerify: {
        type: Boolean,
        default: false,
    },
    phoneVerify: {
        type: Boolean,
        default: false,
    },
    point: {
        type: Number,
        default: 0,
    }
});

const model = mongoose.model("Challenge", challengesSchema);
module.exports = model;
