const express = require("express");
const router = express.Router();

const {
  getNewMintJSON,
  saveMintNft,
  addNewMintNft,
  getAllMintNft,
  deleteMintNft,
  getMintNftById,
  updateMintNft,
  getMintedNFTByParkId,
  getMyMintedNFT
} = require("../Controller/MintNFTController");

const auth = require("../Middleware/AuthMiddleware");

router.post("/mintNft/get-json", getNewMintJSON);
router.post("/mintNft/confirm", auth, saveMintNft);
router.post("/mintNft/add", auth, addNewMintNft);
router.get("/mintnft/get_mint_nft", getAllMintNft);
router.get("/mintnft/get-my-minted-nft/:id/:chain", getMyMintedNFT)
router.get("/mintnft/get-mint-by-park-id/:id", getMintedNFTByParkId)
router.put("/mintnft/updatemint/:id", updateMintNft);
router.get("/mintnft/getmint/:id", getMintNftById);
router.delete("/mintnft/deletenft/:id", deleteMintNft);



module.exports = router;