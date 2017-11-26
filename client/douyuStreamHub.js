const url = require('url');
const http = require('http');
const assert = require('assert');
const douyu = require('./douyu');

var roomId = 916749;
var payload = 'rate=2&did=9C9B29EE0C9EA895F06C92FDADC800ED&tt=25005158&cptl=0001&sign=047104cffe3ad14056b7249411ebbf1b&ver=2017071351&cdn=tct';


douyu.getPlay(roomId, payload, function(sUrl){
	console.log(`${sUrl}`);
	downloadStream(sUrl);

});

function downloadStream(sUrl) {
	var oUrl = url.parse(sUrl);
	var oOption = {
        hostname: oUrl.hostname,
        //port: 80,
        path: oUrl.path,
        method: 'GET',
        headers: {}
    };

	console.log(oOption);
	var oReq = http.request(oOption, function(oRes, socket, header){
		console.log('on connect');
		console.log(oRes.statusCode);
		console.log(oRes.headers);
		if (oRes.statusCode == 302) {
			downloadStream(oRes.headers.location);

		} else {
			createServer(oRes);
		}

		// oRes.on('data', function(chunk){
		// 	console.log(chunk);
		// });
		// oRes.on('end', function(){
		// 	console.log('on end');
		// });
		
	});
	oReq.on('error', function(){
		console.log('error');
	});
	oReq.end();
}

function createServer(oDownloadResponse) {
	var server = http.createServer(function(req, res){
		res.on('close', function(){
			console.log("client connection closed! remove listener!");
			oDownloadResponse.removeListener('data', onData);
			oDownloadResponse.removeListener('end', onEnd);
		});

		function onData(chunk){
			console.log(chunk.length);
			res.write(chunk);
		}

		function onEnd(){
			res.end();
		}

		oDownloadResponse.on('data', onData);
		oDownloadResponse.on('end', onEnd);
		
	});
	server.listen(8000);
}