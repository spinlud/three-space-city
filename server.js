/**
 * ---------------------------------------------------------------------------------------
 * server.js
 * ---------------------------------------------------------------------------------------
 */

const
    express = require('express'),
    port = process.env.PORT || 8080,
    bodyParser = require('body-parser'),
    httpStatusCodes = require("http-status-codes");


const app = express(),
    server = require("http").createServer(app);


app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', req.get('Origin') || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', "Content-Type, Authentication, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5,  Date, X-Api-Version, X-File-Name");
    res.setHeader('Access-Control-Allow-Credentials', true);
    if (req.method === 'OPTIONS') {
        return res.sendStatus(httpStatusCodes.OK);
    } else {
        return next();
    }
});

app.use(bodyParser.json({limit: "50mb"}));
app.use(express.static(__dirname + "/build"));

app.get("*", function(req, res){
    res.sendFile('index.html', {
        root: "build"
    });
});

server.listen(port, function() {
    console.log('Server listening on port ' + port + '..');
});
