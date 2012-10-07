/*global SockJS console*/

var sock = new SockJS('/Listener');
sock.onopen = function() {
    console.log('open');
};
sock.onmessage = function(e) {
    console.log('message', e.data);
};
sock.onclose = function() {
    console.log('close');
};
