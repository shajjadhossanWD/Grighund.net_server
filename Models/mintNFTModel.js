const mongoose = require("mongoose");

const mintNftSchema = mongoose.Schema(
    {
        gender: {
            type: String,
        },
        color: {
            type: String,
        },
        life_span: {
            type: Number,
        },
        time_span: {
            type: String,
        },
        race_time: {
            type: String,
        },
        breeding: {
            type: Number,
        },
        image: {
            type: String,
        },
        external_url: {
            type: String,
        },
        name: {
            type: String,
        },
        description: {
            type: String,
        },
        breed: {
            type: Number,
        },
        colors: {
            type: Number,
        },
        genderPoint: {
            type: Number,
        },
        groom: {
            type: Number,
        },
        feed: {
            type: Number,
        },
        train: {
            type: Number,
        },
        care: {
            type: Number,
        },
        rest: {
            type: Number,
        },
        maturity: {
            type: Number,
        },
        winnings: {
            type: Number,
        },
        contractAddress: {
            type: String,
        },

        park: {
            type: String
        },
        breeding_time: {
            type: String,
        },
        color_time: {
            type: String,
        },
        gender_time: {
            type: String,
        },
        grooming_time: {
            type: String,
        },
        feeding_time: {
            type: String,
        },
        training_time: {
            type: String,
        },
        care_time: {
            type: String,
        },
        rest_time: {
            type: String,
        },
        maturity_time: {
            type: String,
        },
        winning_time: {
            type: String,
        },
        total: {
            type: Number,
        },
        username_owner: {
            type: String,
        },
        owner_address: {
            type: String,
        },
        minting_status: {
            type: String,
        },
        transaction_id: {
            type: String,
        },
        park_Id: {
            type: String,
        },
        transaction_uri: {
            type: String,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        breedNFT: {
            type: Boolean,
            default: false
        },
        stakeNFT: {
            type: Boolean,
            default: false
        },
        transferOut: {
            type: Boolean,
            default: false
        },
        chain: {
            type: String,
        },
        chainname: {
            type: String,
        }
    },
    {
        timestamps: true
    }

);

const model = mongoose.model("mintNft", mintNftSchema);
module.exports = model;