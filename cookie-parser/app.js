var express = require('express')
const app = express();

var cookieParser = require('cookie-parser')
app.use(cookieParser('i am secret known only to server side'))

app.get('/getCookie', (req, res) => {
    res.send(req.cookies);
})

app.get('/setCookie', (req, res) => {
    res.cookie('theme', 'dark')
    res.redirect('/getCookie')
})

app.get('/setSignedCookie', (req, res) => {
    res.cookie('admin', true, { signed: true })
    res.redirect('/getSignedCookie')
})

app.get('/getSignedCookie', (req, res) => {
    res.send(req.signedCookies);
})
// key:value The key value of cookies should be unique
// or cookies will overwrite

app.listen(3000);