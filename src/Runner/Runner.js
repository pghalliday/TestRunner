var events = require('events');
var util = require('util');

function Runner(files) {
  var self = this;

  self.run = function(callback) {
    setTimeout(function() {
      self.emit('start');
      files.forEach(function(file) {
        self.emit('file', file);
      });
      self.emit('finish');
      callback(true);
    }, 0);
    return self;
  };
}
util.inherits(Runner, events.EventEmitter);

module.exports = Runner;
