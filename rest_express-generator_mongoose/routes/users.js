var express = require('express');
var userRouter = express.Router();
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const User = require('../models/user');
var passport = require('passport')
var authenticate = require('../authenticate')
userRouter.use(bodyParser.json())

/* GET users listing. */
userRouter.get('/', function (req, res, next) {
  res.send('respond with a resource');
})

userRouter.post('/signup', function (req, res, next) {
  User.register(new User({ username: req.body.username }), req.body.password, (err, user) => {
    if (err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json')
      res.json({ err: err })
    }
    else {
      if (req.body.firstname) {
        user.firstname = req.body.firstname
      }
      if (req.body.lastname) {
        user.lastname = req.body.lastname
      }
      user.save((err, user) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json')
          res.json({ err: err })
          return;
        }
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json')
          res.json({ success: true, status: 'Registration Successful!' })
        });
      });

    }
  })

});

// when the post route is executed first the passport.authenticate will be called.
// Only when authentication is suucessful the followint function will be executed.
// If there is an error in authentication passport.authenticate will automatically send back a replay to client about the failure that occured   
userRouter.post('/login', passport.authenticate('local'), (req, res, next) => {
  var token = authenticate.getToken({ _id: req.user._id })
  console.log(req.user + "\n\n------\n\n" + req.session);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json')
  res.json({ success: true, token: token, status: 'You are successfully logged in!' })


})

//Now, the session itself provides this method called destroy and when you call the destroy method, the session is destroyed and the information is removed from the server side pertaining to this session.
//So the clearCookie is a way of asking the client to remove the cookie and the cookie name is the session ID.
userRouter.get('/logout', function (req, res, next) {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/')
  }
  else {
    var err = new Error("You are not logged in");
    res.statusCode = 403//forbidden operation
    next(err)
  }
})

module.exports = userRouter;
