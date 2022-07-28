const Transaction = require('../Models/TransactionModel');

exports.getMyTransaction = async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user._id });
        res.status(200).json({
            message: "Get my transactions successfully",
            transactions
        });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({
            message: "An error occurred while get my transactions",
        });
    }
}

exports.getAllTransaction = async (req, res) => {
    try {
        const transactions = await Transaction.find();
        res.status(200).json({
            message: "Get all transactions successfully",
            transactions
        });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({
            message: "An error occurred while get all transactions",
        });
    }
}