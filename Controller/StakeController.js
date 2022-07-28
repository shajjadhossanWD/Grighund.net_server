const Stake = require('../Models/StakeModel');
const VirtualWallet = require("../Models/VirtualWalletModel");
const mintNFT = require('../Models/mintNFTModel');

exports.addStake = async (req, res) => {
    try {
        let kai = "";
        let dsl = "";

        if (req.body.months > 1) {
            kai = 10 + ((10 / 100) * 20);
            dsl = 10 + ((10 / 100) * 20);
        } else {
            kai = 10;
            dsl = 10;
        }

        const stake = new Stake({
            user: req.user._id,
            mintNFT: req.body.mintNFT,
            stakeStart: new Date(),
            stakeEnd: new Date(new Date().setMonth(new Date().getMonth() + parseInt(req.body.months))),
            months: req.body.months,
            kai: kai,
            dsl: dsl
        });
        await stake.save();

        await mintNFT.findByIdAndUpdate(req.body.mintNFT, {
            stakeNFT: true
        });

        const virtualWallet = await VirtualWallet.findOne({ user: req.user._id });
        const newDSL = (parseFloat(virtualWallet.dsl) + parseFloat(dsl)).toFixed(2);
        const newKai = (parseFloat(virtualWallet.kai || 0) + parseFloat(kai)).toFixed(2);

        await VirtualWallet.findOneAndUpdate({ user: req.user._id }, { $set: { dsl: newDSL, kai: newKai } }, { new: true });

        res.status(200).json({
            stake: stake
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "An error occured while adding stake"
        })
    }
}

exports.getStakes = async (req, res) => {
    try {
        const stakes = await Stake.find({ user: req.user._id }).populate('mintNFT');
        res.status(200).json({
            stakes: stakes
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "An error occured while getting stakes"
        })
    }
}