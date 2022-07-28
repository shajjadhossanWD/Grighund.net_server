const express = require('express');
const router = express.Router();

const {
    addStake,
    getStakes
} = require('../Controller/StakeController');

const auth = require('../Middleware/AuthMiddleware');

router.post('/stake/add-stake', auth, addStake);
router.get('/stake/get-stakes', auth, getStakes);

module.exports = router;