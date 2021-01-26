const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');
const path = require('path')
const authenticate = require('./config/passport')
const app = express();
const port = 3000 || process.env.PORT;

//MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded());
app.use(morgan('dev'))
app.use(passport.initialize())

// DATABASE CONNECTION
mongoose.connect('mongodb://localhost:27017/passport', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('DB connected'))
    .catch((err) => console.log(err));

// ROUTES
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/login.html'))
})

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/register.html'))
})

// PASSPORT AS MIDDLEWARE
// session false imp otherwise Error: Failed to serialize user into session
// app.post('/loginResult', passport.authenticate('local', { session: false }), (req, res) => {
//     console.log('REQ.USER', req.user);
//     var token = authenticate.getToken({ _id: req.user._id })
//     console.log('TOKEN', token);
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'application/json')
//     res.json({ success: true, token: token, status: 'You are successfully logged in!' })

// })

//PASSPORT AS CUSTOM CALLBACK - BENEFIT ACCESS TO INFO 
app.post('/loginResult', (req, res, next) => {
    passport.authenticate('local', (err, userObj, info) => {
        console.log('ERR', '\n', "USER", userObj, '\n', 'INFO', info);
        if (err) {
            next(err);
        }
        if (!userObj) {
            res.send(info.message);
        }
        else {
            // session false imp otherwise Error: Failed to serialize user into session
            req.logIn(userObj, { session: false }, function (err) {
                if (err) {
                    next(err);
                }
                else {
                    //console.log('REQ.USER', req.user);
                    var token = authenticate.getToken({ _id: req.user._id }) //with req.login method req.user is undefined i.e. not populated
                    //console.log('TOKEN', token);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json')
                    res.json({ success: true, token: token, status: 'You are successfully logged in!' })
                }
            })

        }
    })(req, res, next)
})

app.post('/registerResult', (req, res, next) => {
    const username = req.body.userID;
    const password = req.body.passwd;
    authenticate.registerUser(username, password)
        .then((user) => {
            //console.log('USER REGISTERTED', user);
            // passport.authenticate as custom callback
            passport.authenticate('local', (err, userObj, info) => {
                console.log('ERR', '\n', "USER", userObj, '\n', 'INFO', info);
                if (err) {
                    next(err);
                }
                if (!userObj) {
                    res.send(info.message);
                }
                else {
                    // session false imp otherwise Error: Failed to serialize user into session
                    req.logIn(userObj, { session: false }, function (err) {
                        if (err) {
                            next(err);
                        }
                        else {
                            //console.log('REQ.USER', req.user);
                            var token = authenticate.getToken({ _id: req.user._id }) //with req.login method req.user is undefined i.e. not populated
                            //console.log('TOKEN', token);
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json')
                            res.json({ success: true, token: token, status: 'You are successfully logged in!' })
                        }
                    })

                }
            })(req, res, next)
        })
        .catch((err) => {
            //console.log("CAUGHT ERR", err);
            next(err);
        })

})

// session false imp otherwise Error: Failed to serialize user into session
app.get('/jwtProtected', passport.authenticate('jwt', { session: false }), (req, res) => {
    //console.log(req.user); // req.user is populated by jwt strategy
    res.send('we made it')
})

// ERROR HANDLING
app.use(function (err, req, res, next) {
    console.log(err);
    res.status(err.status || 500);
    res.send(err.message || 'something went wrong');
})

app.listen(port, () => {
    console.log('server started');
});