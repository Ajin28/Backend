const express = require('express');
const app = express();

app.get('/signup', (req, res) => {
    if (!req.headers.authorization) {
        res.setHeader('WWW-Authenticate', 'Basic');
        res.statusCode = 401;
        res.end()

    }
    else {
        res.redirect('/loggedIn')
    }
})

app.get('/loggedIn', (req, res) => {
    if (!req.headers.authorization) {
        res.send('You are not logged in <a href="/signup"> Singup here</a>')
    }
    else
        res.send(req.headers.authorization + '<br>Successfully Authenticated<br><a href="/user">See User info </a>')

})

app.get('/user', (req, res) => {
    if (!req.headers.authorization) {
        res.send('You are not looged in <a href="/signup"> Singup here</a>')
    }
    else {
        const auth = req.headers.authorization.split(' ')
        console.log(auth)

        var base64encodedToString = new Buffer.from(auth[1], 'base64').toString();
        console.log(base64encodedToString)

        var usernameNpassword = base64encodedToString.split(':')
        console.log(usernameNpassword);

        //or
        //var usernameNpassword = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');    
        res.send(req.headers.authorization + '<br>' + "Username: " + usernameNpassword[0] + '<br>' + "Password :" + usernameNpassword[1])
    }
})

app.listen(3000);