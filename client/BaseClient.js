const url = require('url');
const http = require('http');
const assert = require('assert');
const douyu = require('./douyu');

var _bStop = true;
var _nInterval = 60 * 1000;

function BaseClient(sName, sRoomId) {
    this.sName = sName;
    this.sRoomId = sRoomId;
}

BaseClient.prototype.run = function() {
    console.log('run');
    
    var self = this;
    var sServiceUrl = "http://localhost:3000/api/_all";
    var oUrl = url.parse(sServiceUrl); // + this.sName);
    var oOption = {
        hostname: oUrl.hostname,
        port: oUrl.port,
        path: oUrl.path,
        method: 'GET',
        headers: {}
    };

    var oReq = http.request(oOption, function (res){
        let rawData = '';
        console.log(`status code = ${res.statusCode}`);
        res.on('data', function(chunk){
            rawData += chunk;
        });
        res.on('end', function(){
            _onMessage.call(self, rawData, { sName: self.sName, sRoomId: self.sRoomId, sender: self });
        });
    });
    oReq.on('error', function(err){
        console.error(err);
        console.log("wait and retry");
        setTimeout(function(){
            self.run();
        }, _nInterval);
    });
    oReq.end();

    
};

BaseClient.prototype.start = function() {
    _bStop = false;
    this.run();
};

BaseClient.prototype.stop = function() {
    _bStop = true;
};

function _onMessage(oData, oContext) {
    var self = oContext.sender;
   self.onMessage(oData, oContext);

    if (!_bStop) {
        self.run();
    }
}
/*
 * Event onMessage
 */
BaseClient.prototype.onMessage = function(oData, oContext) {
    //oData.rtmp_url
};


module.exports = BaseClient;
