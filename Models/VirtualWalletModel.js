const mongoose = require('mongoose');

const virtualWalletSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        usdsc: {
            type: String,
        },
        dsl: {
            type: String,
        },
        kai: {
            type: String,
        }
    },
    {
        timestamps: true,
    }
);

const model = mongoose.model("VirtualWallet", virtualWalletSchema);
module.exports = model;
