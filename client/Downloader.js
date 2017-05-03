const url = require('url');
const http = require('http');
const fs = require('fs');
const BASE_PATH = "e:\\temp";


function Downloader() {

}

Downloader.prototype.run = function(sUrl, sFullPathName) {
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
        var fd = fs.openSync(_generateFullPathName(), "w");
        let aPool = [];
        let nSize = 0;
        let nTotalSize = 0;

        res.on('data', function(chunk){
        	nSize += chunk.length;
        	nTotalSize += chunk.length;
        	aPool.push(chunk);
        	console.log(".");

        	fs.writeSync(fd, "start\n");
        	if (nSize > 1024 * 1024) {
        		var buff = Buffer.concat(aPool);
        		fs.writeSync(fd, buff, 0, buff.length);
        		aPool = [];
        		nSize = 0;
        		console.log(`total size: ${nTotalSize}`);
        	}
        });
        res.on('end', function(){
            var buff = Buffer.concat(aPool);
            //console.log(buff);
        	fs.writeSync(fd, buff, 0, buff.length);
            fs.close(fd);
        });
    }).end(); // return <http.ClientRequest>
};

function _generateFullPathName() {
	var ts = Math.floor(new Date().getTime() / 1000);
	var filename = BASE_PATH + "\\" + ts + ".flv";
	return filename;
}

module.exports = Downloader;

var d = new Downloader();
d.run("http://www.baidu.com/");
