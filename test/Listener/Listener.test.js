/*global describe it before after*/

var expect = require('chai').expect,
  Server = require('../../src/Server/Server');

describe('Listener', function() {
  var server;
  
  before(function(done) {
    server = new Server(8080, 1000);
    server.start(done);
  });

  it('should connect to server on load', function(done) {
    // extend the mocha test timeout as we will wait for someone to connect using a browser
    this.timeout(10000);
    console.log('You have 10 seconds to load http://localhost:8080 in a browser...');
    server.on('listener', function() {
      done();
    });
  });

  after(function(done) {
    server.stop(done);
  });
});
