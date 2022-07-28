const express = require("express");
const router = express.Router();
 
const { addNewNft, getNewNft } = require("../Controller/GrighundControlar");
const upload = require("../Middleware/Upload");

router.post("/Nft/add", [upload.single("image")],  addNewNft);
router.get("/nft/get", getNewNft);


module.exports = router;
