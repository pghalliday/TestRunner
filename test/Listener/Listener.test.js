/*global describe it before after*/

var expect = require('chai').expect,
  Server = require('../../src/Server/Server'),

describe('Listener', function() {
  var server;
  
  before(function(done) {
    server = new Server(8080);
    server.start(done);
  });

  it('should connect to server on load', function(done) {
    // stop the mocha test timeout as we will wait for someone to connect using a browser
    this.timeout(0);
    console.log('Load http://localhost:8080 in a browser to continue the Listener test');
    done();
  });

  after(function(done) {
    server.stop(done);
  });
});
