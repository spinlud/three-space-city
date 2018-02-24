/**
 * ---------------------------------------------------------------------------------------
 * server.js
 * ---------------------------------------------------------------------------------------
 */


"use strict";


/*
 * ---------------------------------------------------------------------------------------
 * environment
 * ---------------------------------------------------------------------------------------
 */

// const port = process.env.PORT || 4500;



/*
 * ---------------------------------------------------------------------------------------
 * global variables
 * ---------------------------------------------------------------------------------------
 */

const
    express = require('express'),
    config = require("./config"),
    port = config.port,
    path = require('path'),
    bodyParser = require('body-parser'),
    cookiePraser = require('cookie-parser'),
    morgan = require("morgan"),
    httpStatusCodes = require("http-status-codes");


let app = express(),
    server = require("http").Server(app);


/*
 * ---------------------------------------------------------------------------------------
 * configuration
 * ---------------------------------------------------------------------------------------
 */

// Add headers
app.use(function (req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', req.get('Origin') || '*');
    // res.setHeader("Access-Control-Allow-Origin", "http://localhost:4500, http://localhost:3000");

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', "Content-Type, Authentication, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5,  Date, X-Api-Version, X-File-Name");

    // Set to true if you need the website to include cookies in the requests sent to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    if (req.method === 'OPTIONS') {
        return res.sendStatus(httpStatusCodes.OK);
    } else {
        return next();
    }
});

app.use(morgan("dev")); // log every request to the console
app.use(bodyParser.json({limit: "50mb"}));
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/bower_components"));


/*
 * ---------------------------------------------------------------------------------------
 * routing
 * ---------------------------------------------------------------------------------------
 */
app.get("*", function(req, res){
    res.sendFile('index.html', {
        root: "public"
    });
});


/*
 * ---------------------------------------------------------------------------------------
 * server
 * ---------------------------------------------------------------------------------------
 */
function startServer() {
    server.listen(port, function() {
        console.log('Server listening on port ' + port + '..');
    });
}

startServer();












