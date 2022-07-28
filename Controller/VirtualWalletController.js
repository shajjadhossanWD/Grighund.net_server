const VirtualWallet = require("../Models/VirtualWalletModel");

exports.getMyVirtualWallet = async (req, res) => {
    try {
        const virtualWallet = await VirtualWallet.findOne({ user: req.user._id });
        res.status(200).json(virtualWallet);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "An error has occurred trying to get your virtual wallet",
        });
    }
}

exports.deductFromVirtualWallet = async (req, res) => {
    try {
        const virtualWallet = await VirtualWallet.findOne({ user: req.user._id });
        if (virtualWallet) {
            if (parseFloat(virtualWallet[req.body.token]) < parseFloat(req.body.amount)) {
                const deduct = parseFloat(req.body.amount) - parseFloat(virtualWallet[req.body.token]);
                virtualWallet[req.body.token] = "0.00";
                virtualWallet.save();
                res.status(200).json({
                    amount: deduct.toFixed(2),
                })
            }
            else {
                const deduct = parseFloat(virtualWallet[req.body.token]) - parseFloat(req.body.amount);
                virtualWallet[req.body.token] = deduct.toFixed(2);
                virtualWallet.save();
                res.status(200).json({
                    amount: 0.00,
                })
            }
        } else {
            res.status(500).json({
                message: "You don't have a virtual wallet",
            });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "An error has occurred trying to deduct from your virtual wallet",
        });
    }
}

exports.topupVirtualWallet = async (req, res) => {
    try {
        const virtualWallet = await VirtualWallet.findOne({ user: req.user._id });
        const newusdsc = (parseFloat(virtualWallet.usdsc) + parseFloat(req.body.amount)).toFixed(2);

        const update = await VirtualWallet.findOneAndUpdate({ user: req.user._id }, { $set: { usdsc: newusdsc } }, { new: true });

        virtualWallet.save();
        res.status(200).json({
            message: "Topup successful",
            virtualWallet: update,
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "An error has occurred trying to topup your virtual wallet",
        });
    }
}