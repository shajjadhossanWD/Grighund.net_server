// const User = require('../Schema/mintNftSchema');
const mintNft = require('../Models/mintNFTModel');
const fs = require('fs');
const Park = require('../Models/ParkModel');
const Transaction = require('../Models/TransactionModel');
const User = require('../Models/UserModel');


const getRandomString = (length) => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

exports.getNewMintJSON = async (req, res) => {
    try {
        const objNft = {
            image: req.body.image,
            name: req.body.name,
            description: req.body.description,
            external_url: "grighund.net",
        }

        // stringify JSON Object
        let jsonContent = JSON.stringify(objNft);
        // console.log(jsonContent);

        const filename = getRandomString(4)

        fs.writeFile(`./assets/${filename}.json`, jsonContent, 'utf8', function (err) {
            if (err) {
                console.log("An error occured while writing JSON Object to File.");
                return console.log(err);
            }

            // console.log("JSON file has been saved.");
        });
        const pathMint = `https://backend.grighund.net/assets/${filename}.json`;
        res.status(200).json({
            pathMint
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "An error occurred while generate json",
        });
    }
}

exports.saveMintNft = async (req, res) => {
    try {
        const newNft = new mintNft({
            image: req.body.image,
            name: req.body.name,
            description: req.body.description,
            external_url: "grighund.net",
            gender: req.body.gender,
            color: req.body.color,
            breeding: req.body.breeding,
            life_span: req.body.life_span,
            time_span: req.body.time_span,
            race_time: req.body.race_time ? req.body.race_time : new Date(),
            breed: req.body.breed,
            colors: req.body.colors,
            genderPoint: req.body.genderPoint,
            groom: req.body.groom,
            feed: req.body.feed,
            train: req.body.train,
            care: req.body.medicalCare,
            rest: req.body.rest,
            maturity: req.body.maturity,
            winnings: req.body.winnings,
            contractAddress: req.body.contractAddress,
            ID: req.body.Id,
            breeding_time: req.body.breeding_time,
            color_time: req.body.color_time,
            gender_time: req.body.gender_time,
            grooming_time: req.body.groom_time,
            feeding_time: req.body.feeding_time,
            training_time: req.body.training_time,
            care_time: req.body.care_time,
            rest_time: req.body.rest_time,
            maturity_time: req.body.maturity_time,
            winning_time: req.body.winning_time,
            total: req.body.total,
            username_owner: req.body.username_owner,
            owner_address: req.body.owner_address,
            minting_status: "Yes",
            transaction_id: req.body.transaction_id,
            transaction_uri: req.body.link_hash,
            user: req.user._id,
            park_Id: req.body.park_Id,
            chain: req.body.chain,
        })

        await Park.findByIdAndUpdate(req.body.park_Id, {
            status: 'Yes',
            minted: 'User'
        })

        const mintedNFT = await newNft.save();

        const newTransaction = new Transaction({
            type: "Mint BSC NFT",
            user: req.user._id,
            url: req.body.link_hash,
        })
        await newTransaction.save();

        res.status(200).json({
            message: "The process of minting should be done properly.",
            mintedNFT
        });
    }
    catch (e) {
        console.log(e)
        res.status(500).json({
            message: "An error occurred while mint nft",
        });
    }
}


exports.addNewMintNft = async (req, res) => {
    try {
        const newNft = new mintNft({
            image: req.body.image,
            name: req.body.name,
            description: req.body.description,
            external_url: "grighund.net",
            gender: req.body.gender,
            color: req.body.color,
            breeding: req.body.breeding,
            life_span: req.body.life_span,
            time_span: req.body.time_span,
            race_time: req.body.race_time ? req.body.race_time : new Date(),
            breed: req.body.breed,
            colors: req.body.colors,
            genderPoint: req.body.genderPoint,
            groom: req.body.groom,
            feed: req.body.feed,
            train: req.body.train,
            care: req.body.care,
            rest: req.body.rest,
            maturity: req.body.maturity,
            winnings: req.body.winnings,
            contractAddress: req.body.contractAddress,
            breeding_time: req.body.breeding_time,
            color_time: req.body.color_time,
            gender_time: req.body.gender_time,
            grooming_time: req.body.grooming_time,
            feeding_time: req.body.feeding_time,
            training_time: req.body.training_time,
            care_time: req.body.care_time,
            rest_time: req.body.rest_time,
            maturity_time: req.body.maturity_time,
            winning_time: req.body.winning_time,
            total: req.body.total,
            username_owner: req.body.username_owner,
            owner_address: req.body.owner_address,
            minting_status: req.body.minting_status,
            transaction_id: req.body.transaction_id,
            transaction_uri: req.body.link_hash,
            chainname: req.body.chainname,

            // user: req.user._id
        })

        await Park.findByIdAndUpdate(req.body.park_Id, {
            $set: {
                status: 'Yes',
                minted: 'Admin'
            }
        })

        const mintedNFT = await newNft.save();

        const newTransaction = new Transaction({
            type: "Mint BSC NFT",
            user: req.user._id,
        })
        await newTransaction.save();

        res.status(200).json({
            message: "The process of minting should be done properly.",
            mintedNFT
        });
    }
    catch (e) {
        console.log(e)
        res.status(500).json({
            message: "Please login with wallet first",
        });
    }

}


exports.getAllMintNft = async (req, res) => {
    try {
        const mintNfts = await mintNft.find(req.params.name).sort({ createdAt: -1 });
        res.status(200).json({
            mintNfts
        });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({
            message: "An error occurred while get Mint NFT",
        });
    }
}

exports.getMintNftById = async (req, res) => {
    try {
        const mint = await mintNft.findById(req.params.id);
        res.status(200).json({
            message: "Get mintnft successfully",
            mint
        });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({
            message: "An error occurred while get admin",
        });
    }
}

exports.getMintedNFTByParkId = async (req, res) => {
    try {
        const nft = await mintNft.findOne({ park_Id: req.params.id });
        res.status(200).json(nft);
    }
    catch (e) {
        console.log(e);
        res.status(500).json({
            message: "An error occurred while get Mint NFT",
        });
    }
}

exports.getMyMintedNFT = async (req, res) => {
    try {
        const nfts = await mintNft.find({ user: req.params.id, chain: req.params.chain });
        res.status(200).json(nfts);
    }
    catch (e) {
        console.log(e);
        res.status(500).json({
            message: "An error occurred while get Mint NFT",
        });
    }
}


// exports.updateMintUrl = async(req, res) =>{
//     try{
//         const urlMint = await mintNft.findById(req.params.id);

//         urlMint.transaction_url = req.body.transaction_url

//         const update = await urlMint.save();
//         if (update) {
//             res.status(200).json({
//                 urlMint: {
//                     _id: update._id,
//                     transaction_url:  update.transaction_url,
//                 },
//             })
//         }
//     }
//     catch (e) {
//         console.log(e)
//         res.status(500).json({
//             message: "An error occurred while updating your Mint NFT",
//         });
//     }
// }









exports.updateMintNft = async (req, res) => {
    try {
        const newNft = await mintNft.findById(req.params.id);


        if (req.body.description) {
            newNft.description = req.body.description;
        }
        if (req.body.breeding) {
            newNft.breeding = req.body.breeding;
        }
        if (req.body.life_span) {
            newNft.life_span = req.body.life_span;
        }
        if (req.body.breed) {
            newNft.breed = req.body.breed;
        }
        if (req.body.colors) {
            newNft.colors = req.body.colors;
        }
        if (req.body.genderPoint) {
            newNft.genderPoint = req.body.genderPoint;
        }
        if (req.body.groom) {
            newNft.groom = req.body.groom;
        }
        if (req.body.feed) {
            newNft.feed = req.body.feed;
        }
        if (req.body.train) {
            newNft.train = req.body.train;
        }
        if (req.body.care) {
            newNft.care = req.body.care;
        }
        if (req.body.rest) {
            newNft.rest = req.body.rest;
        }
        if (req.body.maturity) {
            newNft.maturity = req.body.maturity;
        }
        if (req.body.winnings) {
            newNft.winnings = req.body.winnings;
        }
        if (req.body.total) {
            newNft.total = req.body.total;
        }
        if (req.body.username_owner) {
            newNft.username_owner = req.body.username_owner;
        }
        if (req.body.owner_address) {
            newNft.owner_address = req.body.owner_address;
        }

        const update = await newNft.save();

        if (update) {
            res.status(200).json({
                message: "Update successful",
                newNft: {
                    _id: update._id,
                    description: update.description,
                    breeding: update.breeding,
                    life_span: update.life_span,
                    breed: update.breed,
                    colors: update.colors,
                    genderPoint: update.genderPoint,
                    groom: update.groom,
                    feed: update.feed,
                    train: update.train,
                    care: update.care,
                    rest: update.rest,
                    maturity: update.maturity,
                    winnings: update.winnings,
                    total: update.total,
                    username_owner: update.username_owner,
                    owner_address: update.owner_address,

                },
            })
        }

    }
    catch (e) {
        console.log(e)
        res.status(500).json({
            message: "An error occurred while updating your Mint NFT",
        });
    }
}

exports.deleteMintNft = async (req, res) => {
    try {
        const mintNftDelete = await mintNft.findById(req.params.id);
        await mintNftDelete.remove();
        res.status(200).json({
            message: "Mint NFT deleted successfully",
        });
    }
    catch (e) {
        res.status(500).json({
            message: "An error occurred while delete Mint NFT",
        });
    }
}