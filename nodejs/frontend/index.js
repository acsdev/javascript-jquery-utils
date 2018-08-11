var path    = require('path');
var express = require('express');
var favicon = require('serve-favicon');

var server  = express();
var baseDir = path.join(__dirname + '/../../files');

console.log('Static app dir: '.concat(baseDir) );

server.use(function (req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');

    next()
});

server.use( favicon(baseDir.concat('/img/favicon.ico')) );

server.use('/', express.static( baseDir ));

server.listen(8000, function(){ console.log('Listen on port 8000'); });