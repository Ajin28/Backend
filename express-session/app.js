const express = require('express');
const session = require('express-session');

const app = express();

// After this is done, all the requests to the app routes are now using sessions.
// secret is the only required parameter, Which is used to for signing the session ID cookie 
app.use(session({
    secret: 'Your_Secret_Key',
    resave: false,
    saveUninitialized: false
}))

// The session is attached to the request, so you can access it using req.session
// This object (req.session) can be used to get data out of the session, and also to set data.
// This data is serialized as JSON when stored, so you are safe to use nested objects.
app.get('/', function (req, res) {
    if (req.session.page_views) {
        req.session.page_views++;
        res.send("You visited this page " + req.session.page_views + " times");
    } else {
        req.session.page_views = 1;
        res.send("Welcome to this page for the first time!");
    }
});


app.listen(process.env.port || 3000, (err) => {
    if (err) throw err
    console.log("Server has started");
})
// app.listen() takes two params
// port     - to listen on
// callback - that is called when server is ready to accept requests


