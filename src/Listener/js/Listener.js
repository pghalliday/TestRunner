/*global SockJS console*/

(function openSocket() {
  var socket = new SockJS('/Listener');
  socket.onopen = function() {
    console.log('open');
  };
  socket.onclose = function() {
    console.log('close: reconnecting in 100 milliseconds');
    setTimeout(function() {
      openSocket();
    }, 100);
  };    
}());
