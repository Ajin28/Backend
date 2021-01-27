const express = require('express');
const app = express();
const http = require('http');
const https = require('https');
const fs = require('fs')
const port = 3000;
const secPort = 3443;
// http default port is 80
// https default port is 443

app.all('*', (req, res, next) => {
    if (req.secure) {
        return next();
    }
    else {

        // redirecting all http request to https server
        res.redirect(307, 'https://' + req.hostname + ':' + secPort + req.url)

    }
})

app.get('/', (req, res) => {
    res.send('Welcome !!')
})

app.get('/login', (req, res) => {
    res.send('Login !!')
})

app.get('/register', (req, res) => {
    res.send('Register !!')
})

const server = http.createServer(app);
server.listen(port, () => {
    console.log('server listening on port ' + port);
});

// file is read synchronously so that file is completely read before before  HTTPS server is configured.
const options = {
    key: fs.readFileSync(__dirname + '/private.key'),
    cert: fs.readFileSync(__dirname + '/certificate.pem')
};
const secureServer = https.createServer(options, app);
secureServer.listen(secPort, () => {
    console.log('secure server listening on port ' + secPort);
})



// const server = http.createServer(app)
// server.listen(port, hostname, () => {
//     console.log("Express Server Started")
//     console.log(`Server running at http://${hostname}:${port}`)

// })

//or
// app.listen(port, hostname, () => {
//     console.log("Express Server Started")
//     console.log(`Server running at http://${hostname}:${port}`)
// })

// Listen for connections.
//The app.listen() method returns an http.Server object 
// This method is identical to Node’s http.Server.listen().

// var http = require('http')
//   , https = require('https')
//   , express = require('express')
//   , app = express();

// http.createServer(app).listen(80);
// https.createServer({ ... }, app).listen(443);

// The app returned by express() is in fact a JavaScript Function, 
// designed to be passed to Node’s HTTP servers as a callback to handle requests. 
// This makes it easy to provide both HTTP and HTTPS versions of your app with the same code base, 
// as the app does not inherit from these (it is simply a callback):

//The app.listen() method returns an http.Server object and (for HTTP) is a convenience method for the following:

// app.listen = function() {
//   var server = http.createServer(this);
//   return server.listen.apply(server, arguments);
// };