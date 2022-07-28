const exprees = require('express');
const router = exprees.Router();

const {
    addBreedNFT,
    getBreedNFTs,
    checkNFTIsBreededOrNot,
    getNewBreedJSON,
    getBreedNFT
} = require('../Controller/BreedNFTController');

const auth = require('../Middleware/AuthMiddleware');

router.post('/breed/add-breed-nft', auth, addBreedNFT);
router.get('/breed/get-breed-nfts/:chain', auth, getBreedNFTs);
router.post("/breed/get-json", getNewBreedJSON);
router.get('/breed/get-breed-nft/:id', getBreedNFT);
router.get('/breed/check-nft-is-breeded-or-not/:id', checkNFTIsBreededOrNot);


module.exports = router;