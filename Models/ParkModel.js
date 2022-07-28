const mongoose = require('mongoose');

const parkSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        contractAddress: {
            type: String,
        },
        tokenId: {
            type: String,
        },
        transaction: {
            type: String,
        },
        nft: {
            type: {}
        },
        type: {
            type: String,
        },
        status: {
            type: String,
            default: "No"
        },
        minted: {
            type: String,
            default: "No"
        }

    },
    {
        timestamps: true,
    }
);

const model = mongoose.model("Park", parkSchema);
module.exports = model;
