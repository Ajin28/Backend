const express = require('express')
const http = require('http');
const morgan = require("morgan") //Dexter morgan bitch

const hostname = "localhost"
const port = 3000

const app = express();

// HTTP request logger middleware for node.js
app.use(morgan('dev'))

//This is a built-in middleware function in Express. It serves static files.
// __dirname gives absolute path of cwd
// if we just say localhost:3000 by default, it'll serve up the index.html file.
app.use(express.static(__dirname + '/public'))

// This function takes three parameters req, which is the request; res, which is the response, and next. Now, as we saw Express uses additional middleware. So, the next is used when you need to invoke additional middleware to take care of work on your behalf
app.use((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", 'text/html')
    res.end("<html><body><h1>This is an express server </h1></body></html>")
})

const server = http.createServer(app)
server.listen(port, hostname, () => {
    console.log("Express Server Started")
    console.log(`Server running at http://${hostname}:${port}`)

})

//or
// app.listen(port, hostname, () => {
//     console.log("Express Server Started")
//     console.log(`Server running at http://${hostname}:${port}`)
// })

// Listen for connections.
// A node http.Server is returned, with this application (which is a Function) as its callback. If you wish to create both an HTTP and HTTPS server you may do so with the "http" and "https" modules as shown here:
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