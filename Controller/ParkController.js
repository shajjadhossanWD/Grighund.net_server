const Park = require('../Models/ParkModel');
const Transaction = require('../Models/TransactionModel');

exports.addNewPark = async (req, res) => {
    try {
        //check transaction is exist or not
        const transactionURL = await Park.findOne({
            transaction: req.body.transaction
        });

        if (transactionURL) {
            return res.status(400).json({
                message: "You have already parked or someone has used your transaction url. Please contact support at support@grighund.net"
            })
        }

        const park = new Park({
            user: req.user._id,
            contractAddress: req.body.contractAddress,
            tokenId: req.body.tokenId,
            transaction: req.body.transaction,
            nft: req.body.nft,
            type: req.body.type,
        });
        await park.save();

        const transaction = new Transaction({
            type: "Park Polygon NFT",
            user: req.user._id,
            url: req.body.transaction,
        });
        await transaction.save();

        res.status(200).json({
            message: "Your Polygon NFT is parked with us successfully. You can view the NFT immediately.",
        });
    }
    catch (e) {
        res.status(500).json({
            message: "An error occurred while add new park nft",
        });
    }
}

exports.getAllPark = async (req, res) => {
    try {
        const parks = await Park.find({ type: req.params.type }).populate('user');
        res.status(200).json({
            message: "All Parks fetched successfully",
            parks: parks,
        });
    }
    catch (e) {
        console.log(e)
        res.status(500).json({
            message: "An error occurred while get all parks",
        });
    }
}

exports.getParkPolygonById = async (req, res) => {
    try {
        const parkPolygon = await Park.findById(req.params.id).populate('user');
        res.status(200).json({
            message: "Get Park Polygon successfully",
            parkPolygon
        });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({
            message: "An error occurred while get parkPolygon",
        });
    }
}

exports.getMyParkNFT = async (req, res) => {
    try {
        const myNFTs = await Park.find({ user: req.user._id });
        if (myNFTs.length > 0) {
            const polygonNFT = myNFTs.filter(nft => nft.type === "polygon");
            res.status(200).json({
                polygonNFT
            })
        }
        else {
            res.status(200).json({
                message: "You don't have any NFTs parked with us",
                polygonNFT: []
            })
        }

        // else {
        //     res.status(200).json({
        //         polygonNFT: [
        //             { nft: { name: "Sky Blue Grighund - Male (Sample)", image: "https://lh3.googleusercontent.com/AIVjolsocVqdbc5qPv7Sarzjc2Z7aQqmTizHq86FOuf54pbGeQEdKQ0VEJMWoE5UZhc3t-SGKpiYWpPFdNBZPrvLVwZWZedUj71SEg=w304" }, status: "Yes" },
        //         ],
        //         binanceNFT: [
        //             { nft: { name: "Sky Blue Grighund - Male (Sample)", image: "https://lh3.googleusercontent.com/AIVjolsocVqdbc5qPv7Sarzjc2Z7aQqmTizHq86FOuf54pbGeQEdKQ0VEJMWoE5UZhc3t-SGKpiYWpPFdNBZPrvLVwZWZedUj71SEg=w304" } },
        //         ],

        //         message: "No nft found"
        //     })
        // }
    }
    catch (e) {
        console.log(e);
        res.status(500).json({
            message: "An error occurred while get all nft",
        });
    }
}

exports.deleteParkNft = async (req, res) => {
    try {
        const parkNftDelete = await Park.findById(req.params.id);
        await parkNftDelete.remove();
        res.status(200).json({
            message: "Park NFT deleted successfully",
        });
    }
    catch (e) {
        res.status(500).json({
            message: "An error occurred while delete Park NFT",
        });
    }
}

// exports.updateParkPolygon = async (req, res) => {
//     try {
//         const parkPolygon = await Park.findById(req.params.id).populate('user');

//         if (req.body.contractAddress) {
//             parkPolygon.contractAddress = req.body.contractAddress
//         }

//         if (req.body.tokenId) {
//             parkPolygon.tokenId = req.body.tokenId;
//         }

//         if (req.body.transaction) {
//             parkPolygon.transaction = req.body.transaction;
//         }
//         if (req.body.nft) {
//             parkPolygon.nft = req.body.nft;
//         }
//         const update = await parkPolygon.save();

//         if (update) {
//             res.status(200).json({
//                 message: "Update successful",
//                 parkPolygon: {
//                     _id: update._id,
//                     contractAddress: update.contractAddress,
//                     tokenId: update.tokenId,
//                     transaction: update.transaction,
//                     nft: update.nft,
//                 },
//             })
//         }

//     }
//     catch (e) {
//         console.log(e)
//         res.status(500).json({
//             message: "An error occurred while updating your park polygon",
//         });
//     }
// }