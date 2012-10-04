var events = require('events'),
	util = require('util'),
	http = require('http'),
	fs = require('fs'),
	sockJS = require('sockjs');

function Server(port, socketIoLogLevel) {
	var self = this;

	// create the HTTP server
	var httpServer = http.createServer(function(request, response) {
		response.writeHead(200, {'Content-Type': 'text/html'});
		fs.createReadStream('./src/Listener.html').pipe(response);
	});

	// Create a SockJS instance
	var socket = sockJS.createServer({log: function(severity, message) {
		// do nothing for now
	}});

	// accept listeners
	socket.on('connection', function(connection) {
		connection.on('data', function(message) {
			if (message === 'register') {
				connection.write('registered');
			}
		});
	});

	// bind the SockJS instance to the HTTP server
	socket.installHandlers(httpServer, {prefix: '/Listener'});

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