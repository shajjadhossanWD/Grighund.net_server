const mongoose = require('mongoose');

const testnetUSDSCSchema = mongoose.Schema(
    {
        address: {
            type: String,
            default: null
        },
        claims: {
            type: Number,
            default: 0
        },
        email: {
            type: String,
        },
        otp: {
            type: String,
        },
        lastClaimTime: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true,
    }
);

const model = mongoose.model("TestnetUSDSC", testnetUSDSCSchema);
module.exports = model;
