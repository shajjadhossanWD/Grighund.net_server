const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            default: "Unnamed"
        },
        username: {
            type: String,
        },
        email: {
            type: String,
        },
        phone: {
            type: String,
        },
        password: {
            type: String,
        },
        avatar: {
            type: String,
            default: "https://i.ibb.co/BrZCmp5/maleprofile.jpg",
        },
        role: {
            type: String,
            default: "user"
        },
        otp: {
            type: Number
        },
        active: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
    if (!this.isModified) {
        next();
    }

    if (!this.password) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);


});

const model = mongoose.model("Admin", userSchema);
module.exports = model;