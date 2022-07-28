const express = require("express");
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const cors = require("cors");

const path = require('path');

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("monoDB is connected"))
    .catch((err) => console.log(err))

app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.use(express.urlencoded({ extended: true }));


global.__basedir = "./assets/"


// app.use('/strength', require('./Routes/dapp'));
app.use('/api', require('./Routes/GrighundRoutes'));
app.use('/api', require('./Routes/ChallengesRoutes'));
app.use('/api', require('./Routes/UserRoutes'));
app.use('/api', require('./Routes/AdminRoutes'));
app.use('/api', require('./Routes/MintNftRoutes'));
app.use('/api', require('./Routes/ParksRoutes'));
app.use('/api', require('./Routes/TransactionRoutes'));
app.use('/api', require('./Routes/VirtualWalletRoutes'));
app.use('/api', require('./Routes/TestnetUSDSCRoutes'));
app.use('/api', require('./Routes/BreedNFTRoutes'));
app.use('/api', require('./Routes/StakeRoutes'));
app.use('/api', require('./Routes/TransferOutRoutes'));

app.use('/assets', express.static(path.join(__dirname, 'assets')));


app.get('/', (req, res) => {
    res.json('connected')
})
app.listen(5005, () => console.log("server connected"));