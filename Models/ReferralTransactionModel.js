const mongoose = require('mongoose');

const referralTransactionSchema = mongoose.Schema(
    {
        type: {
            type: String,
        },
        usdsc: {
            type: String,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        referral: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    },
    {
        timestamps: true,
    }
);

const model = mongoose.model("ReferralTransaction", referralTransactionSchema);
module.exports = model;
