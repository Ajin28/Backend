const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const morgan = require('morgan')
const session = require('express-session')
const passport = require('passport')
const config = require('./config')
var path = require('path');
const User = require('./model/user')
const mongoose = require('mongoose')
app.use(express.json()); // for parsing json (postman)
app.use(express.urlencoded({ extended: true })); // for parsing form-urlencoded (form)
// extended true - nested objects are formed
// extended false - nested objects not formed

//mongoose
mongoose.connect('mongodb://localhost:27017/auth', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('connected,,'))
    .catch((err) => console.log(err));

app.use(morgan('dev'))
app.use(session({
    secret: "bird is the word",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/welcome.html'))
})

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/login.html'))
})

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/register.html'))
})


app.post('/login', passport.authenticate('local'), (req, res) => {
    console.log(req.session)
    console.log(req.user)
    if (req.user) {
        res.send('Successful login')

    } else {
        res.send('Unsuccessful login')
    }
})

app.post('/register', (req, res) => {
    Users = new User({ username: req.body.username });
    User.register(Users, req.body.password, function (err, user) {
        console.log(user);
        if (err) {
            res.json({
                success: false, message: "Your account could not be saved.Error: ", err
            })
        } else {
            res.json({
                success: true, message: "Your account has been saved"
            })
        }
    })

})



app.listen(port, () => {
    console.log('Auth server started');
})