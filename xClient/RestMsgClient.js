const url = require('url');
const http = require('http');
const assert = require('assert');

var restMsgClient = {};

function send(data){
	var oOption = {
	    hostname: "localhost",
	    port: 3000,
	    path: "/fengtimo",
	    method: 'POST',
	    headers: {}
	};
	var payload = data;

	var oReq = http.request(oOption, function(res){
	    assert.ok(res instanceof http.IncomingMessage, "IncomingMessage");

	    let rawData = '';
	    res.on('data', function(chunk){
	        rawData += chunk;
	    });
	    res.on('end', function(){
	        console.log(rawData);
	    });
	});
	oReq.write(payload);
	oReq.end();
}

function recv(fCallback){
	var oOption = {
	    hostname: "localhost",
	    port: 3000,
	    path: "/fengtimo",
	    method: 'GET',
	    headers: {}
	};

	var oReq = http.request(oOption, function(res){
	    assert.ok(res instanceof http.IncomingMessage, "IncomingMessage");

	    let rawData = '';
	    res.on('data', function(chunk){
	        rawData += chunk;
	    });
	    res.on('end', function(){
	        //console.log(rawData);
	        if (typeof fCallback == 'function') {
	        	fCallback(rawData);
	        }
	    });
	});
	oReq.end();
}

restMsgClient.send = send;
restMsgClient.recv = recv;

module.exports = restMsgClient;