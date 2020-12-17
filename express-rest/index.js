const express = require('express')
const http = require('http');
const morgan = require("morgan")
const bodyParser = require('body-parser')

const hostname = "localhost"
const port = 3000

const app = express();
app.use(morgan('dev'))
// this allows us to parse the body of the request message, which is formatted in JSON format.
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'))



// So when we say app.all, no matter which method is invoked, get, put, post, or delete, for the /dishes REST API endpoint, this code will be executed first by default here.
app.all('/dishes', (req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain')
    next();
    //So when you call next, what it means is that it'll continue on to look for additional specifications down below here, which will match this dishes endpoint.
    // If we modify res and req here, then when you call the next, the modified object will be passed.
})

//if we get a get request on dishes, first app.all will be executed, and then the req and res will be passed on to this second call app.get.
// So in this case, I will no longer need the next, because I'm not going to call further down
app.get('/dishes', (req, res, next) => {
    res.end('Will send all the dishes to you!');
});

app.post('/dishes', (req, res, next) => {
    res.end('Will add the dish: ' + req.body.name + ' with details: ' + req.body.description);
});

app.put('/dishes', (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
});

app.delete('/dishes', (req, res, next) => {
    res.end('Deleting all dishes');
});

app.get('/dishes/:dishId', (req, res, next) => {
    res.end('Will send details of the dish: ' + req.params.dishId + ' to you!');
});

app.post('/dishes/:dishId', (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /dishes/' + req.params.dishId);
});

app.put('/dishes/:dishId', (req, res, next) => {
    res.write('Updating the dish: ' + req.params.dishId + '\n');
    res.end('Will update the dish: ' + req.body.name +
        ' with details: ' + req.body.description);
});

app.delete('/dishes/:dishId', (req, res, next) => {
    res.end('Deleting dish: ' + req.params.dishId);
});


app.use((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", 'text/html')
    res.end("<html><body><h1>This is an express server </h1></body></html>")
})

const server = http.createServer(app)
server.listen(port, hostname, () => {
    console.log("Express-Router Server Started")
    console.log(`Server running at http://${hostname}:${port}`)

})