/*global describe it before after*/

var expect = require('chai').expect,
  Server = require('../../src/Server/Server');

describe('Listener', function() {
  var server;
  
  before(function(done) {
    // NB. use a different socket to other tests as otherwise
    // any reconnecting browser instances may interfere with those other tests
    server = new Server(8081);
    server.start(done);
  });

  it('should connect on load and reconnect if the server bounces', function(done) {
    // extend the mocha test timeout as we will wait for someone to connect
    // using a browser if not already loaded
    this.timeout(10000);
    console.log('You have 10 seconds to load http://localhost:8081 in a browser...');
    server.once('listener', function() {
      server.stop(function() {
        server.start(function() {
          server.once('listener', function() {
            done();          
          });
        });
      });
    });    
  });

  after(function(done) {
    server.stop(done);
  });
});
