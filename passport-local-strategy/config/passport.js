const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require("../models/user");

module.exports = function (passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            //match user
            User.findOne({ email: email })
                .then((user) => {
                    if (!user) {
                        return done(null, false, { message: 'that email is not registered' });
                    }
                    //match pass
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) throw err;

                        if (isMatch) {
                            return done(null, user);
                        } else {
                            return done(null, false, { message: 'pass incorrect' });
                        }
                    })
                })
                .catch((err) => { console.log(err) })
        })

    )
    passport.serializeUser(function (user, done) {
        //console.log(user._id.constructor.name); //class OBjectID
        //console.log(typeof user._id, user._id); //object
        //console.log(typeof user.id, user.id);  //string
        done(null, user.id);
    });
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
};

// usernameField option specifies which input type is used. Here email input type is used
// You can specify the passwordField option as well. However, by default, it is password, so you don’t need to specify it here.

// In order to support login sessions, passport will use the serialize and deserialize methods on the user instances to and from the session.
