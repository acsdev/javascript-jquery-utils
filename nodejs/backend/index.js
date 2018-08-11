var Thread = {
	sleep: function(ms) {
		var start = Date.now()            
		while (true) {
			var clock = (Date.now() - start);
			if (clock >= ms) break;
		}
		
	}
};

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

server.listen(3000, function(){ console.log('Listen on port 3000'); });

server.get('/',function(req, res) {
	res.status( 200 ).json( { 'status':'tested' } );
});

server.get('/listPairNumberString',function(req, res) {
	Thread.sleep(2000);
	
	var array = [];
	for(var i = 0; i < 100; i++) {
		var item  = {
			id   : (i+1),
			desc : Math.random().toString(36).replace(/[^a-z]+/g, '')
		};	
		array.push( item );
	}
	res.status( 200 ).json( array );
});

server.get('/listPairNumberDate',function(req, res) {
	
	Thread.sleep(2000);

	var array = [];
	for(var i = 0; i < 100; i++) {
		var item  = {
			id   : (i+1),
			desc : new Date(new Date().getTime() + (Math.random() * 1000000000)).toISOString()
		};	
		array.push( item );
	}

	res.status( 200 ).json( array );
});

