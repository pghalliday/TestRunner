/*global describe it beforeEach*/

var expect = require('chai').expect;
var ListenerConnection = require('../../src/Server/ListenerConnection');

describe('ListenerConnection', function() {
  var listenerConnection;

  beforeEach(function() {
    listenerConnection = new ListenerConnection();
  });
 
  describe('#forwardTests', function() {
    it('should emit forwarded test data and callback when notified that the tests have completed', function(done) {
      listenerConnection.on('data', function(data) {
        expect(data).to.equal('tests');
        listenerConnection.write('complete');
      });
      listenerConnection.forwardTests('tests', function(error) {
        expect(error).to.equal(null);
        done();
      });
    });
    
    it('should callback with an error if tests are already in progress', function(done) {
      listenerConnection.forwardTests('tests', function(error) {
      });
      listenerConnection.forwardTests('tests', function(error) {
        expect(error.toString()).to.equal((new Error('Already running tests')).toString());
        done();
      });
    });
  });
});
