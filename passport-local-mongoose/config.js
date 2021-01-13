const User = require('./model/user')
const LocalStrategy = require('passport-local').Strategy
const passport = require('passport')

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//console.log(module.exports)
module.exports = passport;
//console.log(module.exports)

//Intially module.export is empty object {}
//whole code in config.js is executed  when we require it in app.js
// but only passort that is exported comes in config variable in app.js