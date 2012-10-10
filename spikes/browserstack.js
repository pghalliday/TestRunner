var BrowserStack = require("browserstack");
var client = BrowserStack.createClient({
    username: "pghalliday@gmail.com",
    password: "varsity1"
});

client.getBrowsers(function(error, browsers) {
   	console.log(error);
    console.log(browsers);

    client.createWorker({
    	os: '',
    	browser: '',
    	version: '',
    	url: 'http://localhost:8081',
    	timeout: 10
    }, function( error, worker ) {
    	console.log(error);
    	console.log(worker);
    });
});