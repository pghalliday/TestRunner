var util = require('util');
var stream = require('stream');

function ListenerConnection() {
  var self = this,
    onComplete;
  
  self.readable = true;
  self.writable = true;
  stream.Stream.call(self);
  
  self.write = function(data) {
    if (data === 'complete') {
      if (onComplete) {
        onComplete(null);
        onComplete = null;
      }
    }
  };
  
  self.end = function(data) {
    self.write(data);
    self.emit('end');
  };
  
  self.forwardTests = function(tests, callback) {
    if (onComplete) {
      callback(new Error('Already running tests'));
    } else {
      onComplete = callback;
      self.emit('data', tests);
    }
  };
}
util.inherits(ListenerConnection, stream.Stream);

module.exports = ListenerConnection;