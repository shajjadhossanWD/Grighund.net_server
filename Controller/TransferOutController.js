const TransferOut = require('../Models/TransferOutModel');
const mintNFT = require('../Models/mintNFTModel');

exports.addTransferOutNFT = async (req, res) => {
    try {
        const transferOut = new TransferOut({
            user: req.user._id,
            mintNFT: req.body.mintNFT,
        });
        await transferOut.save();
        await mintNFT.findByIdAndUpdate(req.body.mintNFT, {
            transferOut: true
        });

        res.status(200).json({
            transferOut: transferOut
        });

    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "An error occured while adding transferOut"
        })
    }
}

exports.getTransferOutsNFT = async (req, res) => {
    try {
        const transferOuts = await TransferOut.find({}).populate('mintNFT').populate('user');
        res.status(200).json({
            transferOuts: transferOuts
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "An error occured while getting transferOuts"
        })
    }
}