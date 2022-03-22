const router = require("express").Router();
const userShema = require('../Schema/Schema');
const mongoose = require('mongoose');

const upload = require('../Utils/multer');

const Profile = new mongoose.model("profile", userShema);


//route that handles new post


router.post('/', upload.single('image'),(req, res)=>{
    let path = "http://localhost:4007/assets/" +req.filename
    let profile = new Profile({
        name: req.body.name,
        userName: req.body.userName,
        email: req.body.email,
        image: path,
    });
     profile
     .save()
     .then(()=> res.json("New User Added successfully"))
     .catch((err) => console.log(err));

  
})

//route that handles new get
router.get('/', async(req, res)=>{
    try{
        let collection = await Profile.find();
        res.json(collection)
    }catch (err){
        console.log(err)
    }
});

module.exports= router;