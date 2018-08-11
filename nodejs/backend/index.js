var express    = require('express');
var bodyParser = require('body-parser');
//
//
var server     = express();

server.use(bodyParser.json());

server.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

server.listen(8001, function(){ console.log('Listen on port 8001'); });

server.get('/',function(req, res) {
	res.status( 200 ).json( { 'status':'tested' } );
});