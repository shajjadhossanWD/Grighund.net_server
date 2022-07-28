const mongoose = require('mongoose');

const GrighundSchema= mongoose.Schema({
    name:{
        type: String,
    },
    image:{
        type: String,
    },
    gender:{
        type: String,
    },
    color:{
        type: String,
    }
});

const model = mongoose.model("Grighund", GrighundSchema);
module.exports = model;