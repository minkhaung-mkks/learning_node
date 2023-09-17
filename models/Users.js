const mongoose = require("mongoose");
const Schema = mongoose.Schema

const userSchema = new Schema({
    userName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        User: {
            type: Number,
            default: 2001
        },
        Admin: Number,
        Editor: Number
    },
    refreshToken: String
})

module.exports = mongoose.model('User', userSchema)