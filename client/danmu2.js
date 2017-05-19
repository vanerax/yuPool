var net = require('net');
var uuid = require('node-uuid');
var md5 = require('md5');
const DanmuConnection = require('./DanmuConnection');


var options = {
	//host: 'danmu.douyutv.com',
	//port: 8602,
	roomId: 610588 //2089340
};

var danmuSocket = DanmuConnection.connect(options);
//danmuSocket.on('chatmsg', function() {});

