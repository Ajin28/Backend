// importing modules 
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');


var UserSchema = new Schema({
    username: { type: String, unique: true, required: true },
});

// plugin for passport-local-mongoose 
UserSchema.plugin(passportLocalMongoose);

// export userschema 
module.exports = mongoose.model("User", UserSchema);

// Passport-Local Mongoose will add a username, hash and salt field to store the username, the hashed password and the salt value.
// Additionally Passport-Local Mongoose adds some methods to your Schema.
// Static methods- Static methods are exposed on the model constructor

