const DANMU_ADDRESS = "danmu.douyutv.com";
const DANMU_PORT = 8602;
const DANMU_ADDRESS_3PARTY = "openbarrage.douyutv.com";
const DANMU_PORT_3PARTY = 8601;
const DANMU_AUTH_ADDRESS = "119.90.49.88";
const DANMU_AUTH_PORT = 8088;
const crypto = require('crypto');
const net = require('net');
const assert = require('assert');
const model = require('./danmu/model');

var roomId = 2089340;

function f1() {
var options = {
    host: DANMU_AUTH_ADDRESS,
    port: DANMU_AUTH_PORT
};

var oAuthClient = net.connect(options, function() {
    //console.log(this);
    // send
    login(oAuthClient, roomId);
});

oAuthClient.on('data', function(data){
    //console.log("on data:");
    //console.log(data);
    
    var oMessage = parseMessage(data);
    if (oMessage.type == 'loginres') {
        console.log("parsed data:");
        console.log(oMessage);
    }
    oAuthClient.end();
});

oAuthClient.on('end', function(){
    console.log('disconnected from server');
    oAuthClient.end();
});

function login(socket, roomId) {
    var now = Math.floor(new Date().getTime() / 1000);
    var devId = "57af5b103a7611e5922a75f42afeee38";
    var vk = md5(now + "7oE9nPEG9xXV69phU31FYCLUagKeYtsF" + devId);

    data = "type@=loginreq/username@=/ct@=0/password@=/roomid@=" + roomId + "/devid@=" + devId + "/rt@=" + now + "/vk@=" + vk + "/ver@=20150929/";
    console.log(data);
    var m = createMessage(data);
    assert(m instanceof Buffer);

    socket.write(m);
}

function keeplive() {

}

function int32ToBuffer(n) {
    var list = [];
    for (var i=0;i<4;i++) {
        list.push(n & 0xFF);
        n >>= 8;
    }
    return new Buffer(list);
}

function md5(str, key) {
    var decipher = crypto.createHash('md5',key)  
    if(key){
      return decipher.update(str).digest()  
    }  
    return decipher.update(str).digest('hex')  
}

function createMessage(data) {
    var buffLength = int32ToBuffer(data.length + 9);
    var buffCode = buffLength;
    var buffMagic = new Buffer([0xb1, 0x02, 0x00, 0x00]);
    var buffContent = new Buffer(data);
    var buffEnd = new Buffer([0x00]);
    return Buffer.concat([buffLength, buffCode, buffMagic, buffContent, buffEnd]);
}

function parseMessage(data) {
    var sMain = data.slice(12, -1).toString('utf-8');
    var oMsg = Message.parse(sMain);
    return oMsg;
}


}

/*
type@=loginres/userid@=1301506724/roomgroup@=0/pg@=0/sessionid@=1756992563/username@=visitor956724/nickname@=visitor956724/live_stat@=1/is_illegal@=0/ill_ct@=/ill_ts@=0/now@=1492358019/ps@=0/es@=0/it@=0/its@=0/npv@=0/best_dlev@=0/cur_lev@=0/nrc@=0/ih@=0/
*/
// username, gid

function Message() {

}
Message.parse = function(sData){
    var oMsg = {};
    sData.split('/').forEach(function(item){
        
        var aToken = item.split('@=');
        if (2 == aToken.length) {
            var key = aToken[0].replace('@S', '/').replace('@A', '@');
            var val = aToken[1].replace('@S', '/').replace('@A', '@');
            oMsg[key] = val;
        }
    });
    return oMsg;
};

Message.create = function(data) {
    var buffLength = new Buffer(4);
    buffLength.writeInt32LE(data.length + 9);

    var buffCode = buffLength;
    var buffMagic = new Buffer([0xb1, 0x02, 0x00, 0x00]);
    var buffContent = new Buffer(data);
    var buffEnd = new Buffer([0x00]);
    return Buffer.concat([buffLength, buffCode, buffMagic, buffContent, buffEnd]);
};

function f2() {
var groupId = -9999;
var heartbeatHandler = null;
var options = {
    host: DANMU_ADDRESS_3PARTY,
    port: DANMU_PORT_3PARTY
};

var oDanmuClient = net.connect(options, function() {
    console.log(this);
    // send
    login();
});

oDanmuClient.on('data', function(data){
    var sData = extractData(data);
    //console.log("on data:");
    //console.log(data);

    var oMessage = Message.parse(sData);
    if (oMessage.type == 'loginres') {
        console.log("parsed data:");
        console.log(oMessage);
        console.log('join group ' + groupId);
        joinGroup();
        startHeartbeat();

    } else if (oMessage.type == 'chatmsg') {
        //console.log('chatmsg:');
        //console.log(oMessage);
        console.log(`${oMessage.nn}: ${oMessage.txt}`);
    } else {
        //console.log('other message: <' + oMessage.type + '>');
    }
    //oDanmuClient.end();
});

oDanmuClient.on('end', function(){
    console.log('disconnected from server');
    oDanmuClient.end();
});

// type@=loginreq/roomid@=****/
function login() {
    var sMessage = "type@=loginreq/username@=visitor1234567/password@=1234567890123456/roomid@=" + roomId + "/";
    var data = Message.create(sMessage);
    oDanmuClient.write(data);
}
// type@=joingroup/rid@=****/gid@=-9999/
// function joinGroup() {
//     //type@=loginreq/roomid@=****/
//     var sMessage = "type@=joingroup/rid@=" + roomId + "/gid@=" + groupId + "/";
//     var data = Message.create(sMessage);
//     oDanmuClient.write(data);
// }

function joinGroup() {
    var oMsg = {
        type: "joingroup",
        rid: roomId,
        gid: groupId
    };
    model.Message.generate(oMsg);
    var data = Message.create(sMessage);
    oDanmuClient.write(data);
}

function startHeartbeat() {
    heartbeatHandler = setInterval(function(){
        var now = Math.floor(new Date().getTime() / 1000);
        var sMessage = "type@=keeplive/tick@=" + now + "/";
        var data = Message.create(sMessage);
        oDanmuClient.write(data);
        console.log("send heartbeat...");
    }, 45000);
}

function extractData(data) {
    var nLength = data.readInt32LE(0);
    //console.log(`!!! ${nLength}, ${data.length}`);
    //console.log(data.toString().split('chatmsg').length); // message merged
    return data.slice(12, -1).toString('utf-8');
}


}

f2();
