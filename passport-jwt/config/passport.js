//when we call passport.authenticate('local') or passport.authenticate('jwt'), it’s going to invoke these respective middlewares.
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const bcrypt = require('bcrypt');
const config = require('../secret.js')

// Local strategy used for login
passport.use(new LocalStrategy(
    {
        usernameField: 'userID', // by default username
        passwordField: 'passwd', // by default password
        session: false
    },
    (username, password, done) => {
        User.findOne({ username: username })
            .then((user) => {
                if (user === null) {
                    return done(null, false, { message: "User Does not exists" })
                } else {
                    bcrypt.compare(password, user.passwordHash, function (err, result) {
                        if (err) {
                            return done(err)
                        }
                        else if (result === true) {
                            return done(null, user, { message: "Login Successful" })
                        }
                        else if (result === false) {
                            return done(null, false, { message: "Username or Password is wrong" });
                        }
                    })
                }

            }).catch((err) => {
                return done(err);
            })
    })
)

// JWT strategy for accessing protected routes without login with the help of token
passport.use(new JwtStrategy(
    {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.secret,

    },
    (jwt_payload, done) => {
        if (Date.now() > jwt_payload.expires) {
            return done('jwt token expired');

        } else {
            console.log("JWT payload: ", jwt_payload);
            User.findOne({ _id: jwt_payload._id }, (err, user) => {
                if (err) {
                    return done(err, false);
                }
                else if (user) {
                    return done(null, user);
                }
                else {
                    return done(null, false, 'Token not valid')
                }

            })
        }
    })
)

function getToken(user) {
    return jwt.sign(user, config.secret, { expiresIn: 3600 });
}

// Registering User - then/catch
// function registerUser(username, password) {
//     return User.findOne({ username: username })
//         .then((userFound) => {
//             console.log("FOUND USER", userFound);
//             if (userFound) {
//                 console.log('inside if');
//                 var err = new Error('Username Taken')
//                 throw err;
//             }
//             else {
//                 console.log('inside else');
//                 var saltRounds = 12;
//                 bcrypt.hash(password, saltRounds)
//                     .then((hash) => {
//                         console.log("HASH", hash);
//                         User.create({ username: username, passwordHash: hash })
//                             .then((user) => {
//                                 console.log("USER", user);
//                                 return user;
//                             })
//                     })
//             }
//         })

// }

// Registering User - await/async
async function registerUser(username, password) {
    var userFound = await User.findOne({ username: username });
    //console.log("FOUND USER", userFound);
    if (userFound) {
        //console.log('inside if');
        var err = new Error('Username Taken')
        throw err;
    } else {
        //console.log('inside else');
        var saltRounds = 12;
        var passwordHash = await bcrypt.hash(password, saltRounds);
        //console.log("HASH", passwordHash);
        var user = await User.create({ username: username, passwordHash: passwordHash })
        //console.log("CREATED", user);
        return user;
    }
}



module.exports = {
    registerUser: registerUser,
    getToken: getToken
}
