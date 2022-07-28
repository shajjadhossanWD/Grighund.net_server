// const router = require("express").Router();
// const userShema = require('../Schema/Schema');
// const mongoose = require('mongoose');

// const DogStrength = new mongoose.model("strengthOfDog", userShema);


// router.post('/', async(req, res)=>{
//   try{
//     let strength = new DogStrength({
//         contract_address: req.body.contract_address,
//         token_id: req.body.token_id,
//         strength: req.body.strength,
//     });

//     console.log(strength)
//     await strength.save()
//           res.json(token);
//   }catch(err){
//       console.log(err);
//   };
// });

// router.get('/', async(req, res)=>{
//     try{
//         let strength = await DogStrength.find();
//         res.json(strength)
//     }catch (err){
//         console.log(err)
//     }
// });

// module.exports= router;