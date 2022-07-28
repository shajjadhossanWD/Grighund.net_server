const express = require("express");
const router = express.Router();

const { addNewPark, getAllPark, getMyParkNFT, getParkPolygonById, deleteParkNft } = require("../Controller/ParkController");

const auth = require("../Middleware/AuthMiddleware");

router.post("/parks/add", auth, addNewPark);
router.get("/parks/my-park-nft", auth, getMyParkNFT);
router.get("/parks/parkid/:id", getParkPolygonById);
router.get("/parks/:type", getAllPark);

router.delete("/parks/delete/:id", deleteParkNft);





module.exports = router;
