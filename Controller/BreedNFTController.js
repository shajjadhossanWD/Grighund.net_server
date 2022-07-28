const BreedNFT = require('../Models/BreedNFTModel');
const mintNFT = require('../Models/mintNFTModel');
const Grighund = require('../Models/GrighundModel');
const fs = require('fs');

exports.checkNFTIsBreededOrNot = async (req, res) => {
    try {
        const breedNFT = await mintNFT.findOne({
            _id: req.params.id
        });
        if (breedNFT.breedNFT === true) {
            res.status(409).json({
                message: 'This NFT is already Breeded'
            });
        } else {
            res.status(200).json({
                message: 'This NFT is not Breeded'
            });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "An error occured while checking breedNFT"
        });
    }
}
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


exports.getNewBreedJSON = async (req, res) => {
    try {
        const gender = req.body.gender === "Male" ? "Female" : "Male";
        const getNFT = await Grighund.findOne({
            name: `${req.body.color} Grighund - ${gender}`
        })
        const objNft = {
            image: getNFT.image,
            name: getNFT.name,
            gender: getNFT.gender,
            description: getNFT.description,
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

exports.addBreedNFT = async (req, res) => {
    try {
        let fitForRace = "";
        // check current date is less then 1 Aug 2022
        if (new Date() < new Date("2022-08-01")) {
            fitForRace = new Date("2023-02-01");
        }
        else {
            // set fitForRace to add 6 months to current date
            fitForRace = new Date(new Date().setMonth(new Date().getMonth() + 6));
        }

        const gender = req.body.gender === "Male" ? "Female" : "Male";
        const getNFT = await Grighund.findOne({
            name: `${req.body.color} Grighund - ${gender}`
        })

        const newBreedNFT = new BreedNFT({
            image: getNFT.image,
            name: getNFT.name,
            description: getNFT.description,
            external_url: "grighund.net",
            gender: getNFT.gender,
            color: getNFT.color,
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
            fitForRace: fitForRace,
            chain: req.body.chain,
        })
        const result = await newBreedNFT.save();

        const updateMintNFT = await mintNFT.findByIdAndUpdate(req.body.mintNFT, {
            breedNFT: true
        }, { new: true });

        res.status(200).json({
            nft: result,
            updateMintNFT
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "An error occured while adding breedNFT"
        })
    }
}

exports.getBreedNFTs = async (req, res) => {
    try {
        const results = await BreedNFT.find({
            user: req.user._id,
            chain: req.params.chain
        });
        res.status(200).json({
            nfts: results
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "An error occured while getting breedNFT"
        })
    }
}

exports.getBreedNFT = async (req, res) => {
    try {
        const result = await BreedNFT.findById(req.params.id);
        res.status(200).json({
            nft: result
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "An error occured while getting breedNFT"
        })
    }
}