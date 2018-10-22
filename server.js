/**
 * Title: Homework assignment #1
 * Description: When someone posts anything to the route /hello,
 * you should return a welcome message, in JSON format. This message can be anything you want.
 * Author: David Cash
 * Date: 10/22/2018
 */


 // Dependencies
 const http = require('http');
 const url = require('url');
 const StringDecoder = require('string_decoder').StringDecoder;
 const config = require('./config');

 // Instantiate Server
 const server = http.createServer((req,res) => {
    unifiedServer(req,res);
 });

 // Start the Server
 server.listen(config.port, () => {
    console.log(`Port: ${config.port}\nMode: ${config.envName}`);
 });



 // All the server logic
var unifiedServer = (req,res) => {

    // Get the url and parse it
    const parsedUrl = url.parse(req.url,true);

    // Get the path
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');

    // Get the query string as an object
    const queryStringObject = parsedUrl.query;
    queryStringObject.toString = () => {return JSON.stringify(queryStringObject)}; //Stringify for logging

    // Get the HTTP Method
    const method = req.method.toLowerCase();

    // Get the headers as an object
    const headers = req.headers;
    headers.toString = () => {return JSON.stringify(headers)}; //Stringify for logging

    // Get the payload, if any
    var decoder = new StringDecoder('utf-8');
    var buffer = '';
    req.on('data', (data) => {
        buffer += decoder.write(data);
    });
    req.on('end', () => {
        buffer += decoder.end();

        // Choose the handler this request should go to.
        // If one is not found, use notFound handler
        var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        // construct the data object to send to the handler
        var data = {
            'trimmedPath' : trimmedPath,
            'queryStringObject' : queryStringObject,
            'method' : method,
            'headers' : headers,
            'payload' : buffer
        };

        // Route the request to the handler specified in the router
        chosenHandler(data, (statusCode,payload) => {
            // Use the status code called back by the hander or default to 200
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

            // Use the payload called back by the handler, or default to empty object
            payload = typeof(payload) == 'object' ? payload : {};

            // Convert the payload to a string
            var payloadString = JSON.stringify(payload);

            // Return the response
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);

            // Log the request
            console.log(`Request: ${trimmedPath}\nMethod: ${method}\nParams: ${queryStringObject}\nStatus Code: ${statusCode}\nPayload: ${payloadString}\nHeaders: ${headers}\n\n`);
        });
    });
};

// Defie the handlers
var handlers = {}

// Ping Handler
handlers.hello = (data,callback) => {
    callback(200,{'message' : 'Hello to you too!'});
};

// Not found handler
handlers.notFound = (data,callback) => {
    callback(404)
}

//Define a request router
var router = {
    'hello' : handlers.hello
};