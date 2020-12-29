var express = require('express');
var userRouter = express.Router();
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const User = require('../models/user');

userRouter.use(bodyParser.json())

/* GET users listing. */
userRouter.get('/', function (req, res, next) {
  res.send('respond with a resource');
})

userRouter.post('/signup', function (req, res, next) {
  User.findOne({ username: req.body.username })
    .then((user) => {
      if (user != null) {
        var err = new Error('User ' + req.body.username + ' already exists')
        err.status = 403;
        next(err)
      }
      else {
        return User.create({
          username: req.body.username,
          password: req.body.password
        })
      }
    })
    .then(user => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json')
      res.json({ status: 'Registration Successful!', user: user })
    })//(err)=>{next(err))}
    .catch(err => { next(err) })
});

userRouter.post('/login', function (req, res, next) {
  console.log('req.session: ', req.session);

  if (!req.session.user) {
    var authHeader = req.headers.authorization;
    if (!authHeader) {
      var err = new Error('You are not authenticated!');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      return next(err);
    }
    var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    var username = auth[0];
    var password = auth[1];
    User.findOne({ username: username })
      .then((user) => {
        if (user === null) {
          var err = new Error('User ' + username + ' does not exist');
          err.status = 403;
          next(err);
        }
        else if (user.password != password) {
          var err = new Error('Password does not match');
          err.status = 403;
          next(err);
        }
        else if (user.username === username && user.password === password) {
          req.session.user = 'authenticated';
          res.statusCode = 200;
          res.setHeader('Content-type', 'text/plain')
          res.end('You are authenticated'); // authorized
        }
      })
      .catch(err => { next(err) })

  }
  else if (req.session.user === 'authenticated') {
    res.statusCode = 200;
    res.setHeader('Content-type', 'text/plain')
    res.end('You are already authenticated'); // authorized

  }
})

//Now, the session itself provides this method called destroy and when you call the destroy method, the session is destroyed and the information is removed from the server side pertaining to this session.
//So the clearCookie is a way of asking the client to remove the cookie and the cookie name is the session ID.
userRouter.get('/logout', function (req, res, next) {
  if (req.session.user) {
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
