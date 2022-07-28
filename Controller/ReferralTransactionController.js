const ReferralTransaction = require('../Models/ReferralTransactionModel');

exports.getReferralTransaction = async (req, res) => {
    try {
        const referralTransaction = await ReferralTransaction.find({
            user: req.params.id,
        }).populate('user').populate('referral');
        res.status(200).json(referralTransaction);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
}