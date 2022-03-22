const mongoose = require('mongoose');

const userSchema= mongoose.Schema({
    name:{
        type:String,
    },
    userName:{
        type:String,
    },
    email:{
        type:String,
    },
    image:{
        type:String,
    },
});
module.exports =  userSchema;