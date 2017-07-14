var net = require('net');
var uuid = require('node-uuid');
var md5 = require('md5');
const DanmuConnection = require('./DanmuConnection');


var options = {
	//host: 'danmu.douyutv.com',
	//port: 8602,
	roomId: 156277 // 2089340
};

if (process.argv.length >= 3) {
	options.roomId = process.argv[2];
	console.log(`room id = ${options.roomId}`);
}
var danmuSocket = DanmuConnection.connect(options);
//danmuSocket.on('chatmsg', function() {});

