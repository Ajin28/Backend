var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var session = require('express-session');
var fileStore = require('session-file-store')(session);
var passport = require('passport');
var authenticate = require('./authenticate')

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


app.use(session({
	name: "session-id",
	secret: 'ajin',
	saveUninitialized: false,
	resave: false,
	store: new fileStore()
}))

app.use(passport.initialize())
app.use(passport.session())

//So thereby, an incoming user can access the index file at the slash and also access the users endpoint without being authenticated, but any other endpoint, the user has to be authenticated, so that is the way we set this up.
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use(auth);
// Now, we want to do authentication right before we allow the client to be able to fetch data from our server.
// So by doing this, what we are specifying is the default, the client can access any of these, either the static resources in the public folder, or any of the resources, dishes, promotions, or leaders, or even users as we will see later on.
// The client has to be first authorized.
function auth(req, res, next) {

	if (!req.user) {
		var err = new Error('You are not authenticated!');
		err.status = 401;
		return next(err);

	}
	else {
		next();
	}
}


app.use(express.static(path.join(__dirname, 'public')));

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
