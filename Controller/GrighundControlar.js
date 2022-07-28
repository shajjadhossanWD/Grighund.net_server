const Nft = require('../Models/GrighundModel');


exports.addNewNft = async (req, res) => {
    try {
        let path = "https://backend.grighund.net/assets/" + req.filename;

        const Nfts = new Nft({
            name: req.body.name,
            image: req.filename && path,
            gender: req.body.gender,
            color: req.body.color,
        })

        await Nfts.save();
        res.status(200).json({
            message: "NFTs added successfully",
        });
    }
    catch (e) {
        res.status(500).json({
            message: "An error occurred while get all nft",
        });
    }
}

exports.getNewNft = async (req, res) => {
    try {
        const nfts = await Nft.find(req.params.name);
        res.status(200).json({
            nfts
        });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({
            message: "An error occurred while get admin",
        });
    }
}