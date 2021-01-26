const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({

    username: {
        type: String,
        unique: true,
        required: true
    },
    passwordHash: { //salted and hashes by bycrpt
        type: String,
        required: true
    }
})

module.exports = mongoose.model('User', User)