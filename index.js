const express = require("express");
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const cors = require("cors");

const path = require('path');

mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log("monoDB is connected"))
.catch((err)=> console.log(err))

app.use(express.json());
app.use(cors());



global.__basedir = "./assets"

app.use('/profile', require('./Routes/profile'));
app.use('/assets', express.static(path.join(__dirname, 'assets')))



app.get('/', (req, res)=>{
    res.json('connected')
})
app.listen(5005, ()=> console.log("server connected"));