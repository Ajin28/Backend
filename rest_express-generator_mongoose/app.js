var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require("./routes/dishRouter")
var promoRouter = require("./routes/promoRouter")
var leaderRouter = require("./routes/leaderRouter")

const Dishes = require('./models/dishes');
const { use } = require('./routes/index');
const url = "mongodb://localhost:27017/conFusion"
mongoose.connect(url, { useFindAndModify: false, useNewUrlParser: true, useUnifiedTopology: true })
  .then((db) => { console.log("Connected to conFusion"); })
  .catch((err) => { console.log(err); })

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(auth);
// Now, we want to do authentication right before we allow the client to be able to fetch data from our server.
// So by doing this, what we are specifying is the default, the client can access any of these, either the static resources in the public folder, or any of the resources, dishes, promotions, or leaders, or even users as we will see later on.
// The client has to be first authorized.
function auth(req, res, next) {
  console.log(req.headers);
  var authHeader = req.headers.authorization;
  if (!authHeader) {
    var err = new Error('You are not authenticated')
    res.setHeader('WWW-Authenticate', 'Basic')
    err.status = 401;
    next(err)
  }

  var auth = new Buffer(authHeader.split(' ')[1], 'base64').toString().split(':');
  var username = auth[0]
  var password = auth[1]
  console.log(username, password);
  if (username === 'admin' && password === 'password') {
    next();
  }
  else {
    var err = new Error('You are not authenticated')
    res.setHeader('WWW-Authenticate', 'Basic')
    err.status = 401;
    next(err)
  }

}

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/dishes", dishRouter)
app.use("/promotions", promoRouter)
app.use("/leaders", leaderRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
