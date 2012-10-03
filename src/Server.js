var events = require('events'),
	util = require('util'),
	http = require('http'),
	fs = require('fs'),
	io = require('socket.io');

function Server(port, socketIoLogLevel) {
	var self = this;

	// create the http server
	var httpServer = http.createServer(function(request, response) {
		response.writeHead(200, {'Content-Type': 'text/html'});
		fs.createReadStream('./src/Listener.html').pipe(response);
	});

	// attach the socket io instance to the http server
	var socket = io.listen(httpServer, {
		'log level': socketIoLogLevel || 0
	});

	// accept listeners
	socket.on('connection', function(socket) {
		socket.on('register', function() {
			socket.emit('registered');
		});
	});

	this.start = function(callback) {
		self.once('started', callback);
		httpServer.listen(port, function() {
			self.emit('started');
		});
		return self;
	};

	this.stop = function(callback) {
		self.once('stopped', callback);
		httpServer.close(function() {
			self.emit('stopped');
		});
		return self;
	};
}
util.inherits(Server, events.EventEmitter);

module.exports = Server;