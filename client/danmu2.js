var net = require('net');
var fs = require('fs');
var uuid = require('node-uuid');
var md5 = require('md5');
var DateHelper = require('../common/DateHelper');
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


if (process.argv.length >= 4) {
   var bSaveToFile = !!process.argv[3];
   console.log(`save to file: ${bSaveToFile}`);
   if (bSaveToFile) {
      var filename = "E:\\temp\\" + Math.floor(new Date().getTime() / 1000) + ".txt";
      var ws = fs.createWriteStream(filename);

      danmuSocket.getEventEmitter().on('chatmsg', function(oMsg) {
         //console.log(`>> ${oMsg.nn}: ${oMsg.txt}`);
         var sNow = DateHelper.format(new Date());
         ws.write(`[${sNow}] ${oMsg.nn}: ${oMsg.txt}\n`);
      });
   }
}
