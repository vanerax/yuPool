const url = require('url');
const http = require('http');
const https = require('https');
const fs = require('fs');
const BASE_PATH = "e:\\temp";


function Downloader() {

}

Downloader.prototype.onCompleted = function() {

};

Downloader.prototype.run = function(sUrl, sFileName, fOnCompleted) {
    var self = this;

    if (fOnCompleted) {
        this.onCompleted = fOnCompleted;
    }

	var oUrl = url.parse(sUrl);

    var oOption = {
        hostname: oUrl.hostname,
        //port: 80,
        path: oUrl.path,
        method: 'GET',
        headers: {}
    };

    http.request(oOption, function(res){
        //assert.ok(res instanceof http.IncomingMessage, "IncomingMessage");
        if (!sFileName) {
            sFileName = _generateFullPathName();
        }
        var fd = fs.openSync(sFileName, "w");

        let aPool = [];
        let nSize = 0;
        let nTotalSize = 0;

        res.on('data', function(chunk){
        	nSize += chunk.length;
        	nTotalSize += chunk.length;
        	aPool.push(chunk);
        	//console.log(".");

        	//fs.writeSync(fd, "start\n");
        	if (nSize > 1024 * 1024) {
        		var buff = Buffer.concat(aPool);
        		fs.writeSync(fd, buff, 0, buff.length);
        		aPool = [];
        		nSize = 0;
        		//console.log(`total size: ${nTotalSize}`);
        	}
        });
        res.on('end', function(){
            var buff = Buffer.concat(aPool);
            //console.log(buff);
            fs.writeSync(fd, buff, 0, buff.length);
            fs.close(fd);
            if (typeof self.onCompleted == 'function') {
                self.onCompleted();
            }
        });
    }).end(); // return <http.ClientRequest>
};

Downloader.prototype.runWriteStream = function(sUrl, oWriteStream, fComplete) {
    var oUrl = url.parse(sUrl);
    var oOption = {
        hostname: oUrl.hostname,
        //port: 80,
        path: oUrl.path,
        method: 'GET',
        headers: {}
    };

    var oHttp;
    if ("http:" == oUrl.protocol) {
        oHttp = http;
    } else if ("https:" == oUrl.protocol) {
        oHttp = https;
    } else {
        throw "protocol not supported";
    }
    
    oHttp.request(oOption, function(res){
        //assert.ok(res instanceof http.IncomingMessage, "IncomingMessage");

        let nSize = 0;
        let nTotalSize = 0;

        res.on('data', function(chunk){
            nSize += chunk.length;
            nTotalSize += chunk.length;
            if (nSize > 1024 * 1024) {
                // console.log(".");
                console.log(nTotalSize);
                nSize -= 1024 * 1024;
            }
            if (false === oWriteStream.write(chunk)) {
                res.pause();
            }
        });

        res.on('end', function(){
            if (typeof fComplete == 'function') {
                fComplete();
            }
        });

        oWriteStream.on('drain', function() {
            res.resume();
        });

    }).end(); // return <http.ClientRequest>
};

Downloader.prototype.runPipeStream = function(sUrl, oWriteStream) {
    var oUrl = url.parse(sUrl);
    var oOption = {
        hostname: oUrl.hostname,
        //port: 80,
        path: oUrl.path,
        method: 'GET',
        headers: {}
    };

    https.request(oOption, function(res){
        //assert.ok(res instanceof http.IncomingMessage, "IncomingMessage");
        let aPool = [];
        let nSize = 0;
        let nTotalSize = 0;
        res.pipe(oWriteStream);

    }).end(); // return <http.ClientRequest>
};

function _generateFullPathName() {
    var ts = Math.floor(new Date().getTime() / 1000);
    var filename = BASE_PATH + "\\" + ts + ".flv";
    return filename;
}

function _formatSize(n) {

}

Downloader.run = function(sUrl, sFileName, fOnComplete) {
    var d = new Downloader();
    d.run(sUrl, sFileName, fOnComplete);
};

Downloader.runWriteStream = function(sUrl, oWriteStream, fOnComplete) {
    var d = new Downloader();
    d.runWriteStream(sUrl, oWriteStream, fOnComplete);
};

module.exports = Downloader;



