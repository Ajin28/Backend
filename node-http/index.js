//Core Modules
const http = require("http"); //http : the HTTP module is used to configure and start up a simple web server.
const fs = require("fs") //file system :The file system module allows you to read and write files from your local file system
const path = require("path") //path :The path allows you to specify the part of a file in your local file system

const hostname = "localhost";
const port = 3000;

const server = http.createServer((req, res) => {
    console.log("Request for " + req.url + " by method " + req.method);

    if (req.method == 'GET') {
        var fileUrl;
        if (req.url == "/") fileUrl = "/index.html"
        else fileUrl = req.url

        var filePath = path.resolve("./public" + fileUrl)
        const fileExt = path.extname(filePath)
        if (fileExt == '.html') {
            fs.exists(filePath, (exists) => {
                if (!exists) {
                    res.statusCode = 404;
                    res.setHeader("Content-Type", 'text/html')
                    res.end("<html><body><h1>Error 404:" + fileUrl + " not found</h1></body></html>")
                    return;
                }
                res.statusCode = 200;
                res.setHeader("Content-Type", 'text/html')
                fs.createReadStream(filePath).pipe(res)
                //createReadStream method will read in the file from this filePath 
                //and then convert that into stream of bytes, 
                //and then we will pipe this through to the response.
                // So that will be included into the response, in the body of the response
            })

        }
        else {
            res.statusCode = 404;
            res.setHeader("Content-Type", 'text/html')
            res.end("<html><body><h1>Error 404:" + fileUrl + " not an HTML file</h1></body></html>")
        }
    }
    else {
        res.statusCode = 404;
        res.setHeader("Content-Type", 'text/html')
        res.end("<html><body><h1>Error 404:" + req.method + " not supported</h1></body></html>")

    }
})

server.listen(port, hostname, () => {
    console.log("HTTP server started")
    console.log(`Server running at http://${hostname}:${port}`)
})