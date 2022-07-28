const mongoose = require('mongoose');

const transferOutSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        mintNFT: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'mintNft'
        },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('transferOut', transferOutSchema);