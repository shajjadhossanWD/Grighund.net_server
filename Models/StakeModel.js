const mongoose = require('mongoose');

const stakeSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        mintNFT: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'mintNft'
        },
        stakeStart: {
            type: Date,
        },
        stakeEnd: {
            type: Date,
        },
        months: {
            type: Number,
        },
        kai: {
            type: Number,
        },
        dsl: {
            type: Number,
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('stake', stakeSchema);
