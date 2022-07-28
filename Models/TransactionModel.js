const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema(
    {
        type: {
            type: String,
        },
        remarks: {
            type: String,
            default: '-',
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        url: {
            type: String,
        }
    },
    {
        timestamps: true,
    }
);

const model = mongoose.model("Transaction", transactionSchema);
module.exports = model;
