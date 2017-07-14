const RestMsgClient = require('./RestMsgClient');

RestMsgClient.recv(function(data){
	console.log(data);
});