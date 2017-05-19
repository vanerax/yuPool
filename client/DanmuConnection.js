// handle the connection and provide variety of messages
const net = require('net');
const util = require('util');
const EventEmitter = require('events');
const model = require('./danmu/model');
const DanmuPayload = require('./DanmuPayload');

const DANMU_ADDRESS = "danmu.douyutv.com";
const DANMU_PORT = 8602;
const DANMU_ADDRESS_3PARTY = "openbarrage.douyutv.com";
const DANMU_PORT_3PARTY = 8601;
const DANMU_AUTH_ADDRESS = "119.90.49.88";
const DANMU_AUTH_PORT = 8088;
const HEARTBEAT_INTERVAL = 45;
const DEFAULT_GROUP_ID = -9999;

var username = "visitor1234567";
var password = "1234567890123456";

function DanmuConnection() {}

function DanmuSocket(socket, roomId, groupId) {
    var self = this;
    this._socket = socket;
    this._roomId = roomId;
    this._groupId = groupId != undefined ? groupId : DEFAULT_GROUP_ID;
    this._eventEmitter = new EventEmitter();
    this._heartbeat = new DanmuHeartbeat(this._socket);
    this._danmuPayload = new DanmuPayload();

    this._socket.on('connect', function() {
        console.log(`login room: ${self._roomId}`);
        self._login(username, password, self._roomId);
    });

    this._socket.on('data', function(chunk) {
        //console.log('on data');
        //console.log(chunk);
        //var aMsg = model.Payload.parse(chunk);
        self._danmuPayload.push(chunk);
        var aMsg = self._danmuPayload.shiftAll();

        aMsg.forEach(function(sMsg){
            var oMsg = model.Message.parse(sMsg);
            self._eventEmitter.emit('data', oMsg);
            //console.log('>> ', oMsg);
            // translate message
            self._translateMessage(oMsg);
        });
        
    });

    this._socket.on('end', function(){
        self.eventEmmiter.emit('end');
        console.log('disconnected from server');
        self._socket.end();
    });
}

DanmuSocket.prototype.end = function() {};

DanmuSocket.prototype.write = function(sMsg) {
    var bufPayload = model.Payload.generate(sMsg);
    //console.log(bufPayload);
    this._socket.write(bufPayload);
};

DanmuSocket.prototype._translateMessage = function(oMsg) {
    // TODO
    if (oMsg.type && oMsg.type.length > 0) {
        this._eventEmitter.emit(oMsg.type, oMsg);
    }

    switch (oMsg.type) {
    case 'loginres':
        console.log('>> ', oMsg);
        console.log(`join group: ${this._groupId}`);
        this._joinGroup(this._roomId, this._groupId);
        this._heartbeat.start();
        break;

    case 'chatmsg':
        console.log(`${oMsg.nn}: ${oMsg.txt}`);
        break;

    case 'onlinegift':
        // yuwan msg
        break;

    case 'dgb':
        // user sent gift
        break;

    case 'uenter':
        // user entered the room
        console.log(`${oMsg.nn} entered the room. uid=${oMsg.uid}, level=${oMsg.level}`);
        break;

    case 'bc_buy_deserve':
        // what's the meaning of sui?  user info?
        break;

    case 'rss':
        // the reminding of programs
        break;

    case 'ranklist':
        // rank list for total, week, day
        break;
    
    case 'ssd':
        // super danmu (from other room?)
        break;

    case 'spbc':
        // gift broadcast
        break;

    case 'ggbb':
        // hongbao race for room user
        break;

    case 'rankup':
        // top 10 rank up 
        break;

    }
};

// type@=loginreq/roomid@=****/
DanmuSocket.prototype._login = function(usr, pwd, roomId) {
    //var sMessage = "type@=loginreq/username@=visitor1234567/password@=1234567890123456/roomid@=" + roomId + "/";
    var oMsg = {
        type: "loginreq",
        username: usr,
        password: pwd,
        roomid: roomId
    };
    var sMsg = model.Message.generate(oMsg);
    this.write(sMsg);
}

DanmuSocket.prototype._joinGroup = function(roomId, groupId) {
    var oMsg = {
        type: "joingroup",
        rid: roomId,
        gid: groupId
    };
    var sMsg = model.Message.generate(oMsg);
    this.write(sMsg);
}

function DanmuHeartbeat(danmuSocket) {
    this._danmuSocket = danmuSocket;
    this._heartbeatHandler = null;
}

DanmuHeartbeat.prototype.start = function() {
    var self = this;
    if (this._heartbeatHandler == null) {
        this._heartbeatHandler = setInterval(function(){
            self._sendHeartbeat();
        }, HEARTBEAT_INTERVAL * 1000);
    }
};

DanmuHeartbeat.prototype.stop = function() {
    if (this._heartbeatHandler) {
        removeInterval(this._heartbeatHandler);
        this._heartbeatHandler = null;
    }
};

DanmuHeartbeat.prototype._sendHeartbeat = function(){
    var now = Math.floor(new Date().getTime() / 1000);
    var oMsg = {
        type: "keeplive",
        tick: now
    };
    this._danmuSocket.write(model.Message.generate(oMsg));
    console.log("send heartbeat...");
}

DanmuConnection.connect = function(options) {
    if (options.roomId == null) {
        throw new Error("roomId not specified");
    }
    if (options.groupId == null) {
        //throw new Error("groupId not specified");
        groupId = DEFAULT_GROUP_ID;
    }

    if (options.host == null) {
        options.host = DANMU_ADDRESS_3PARTY;
    }
    if (options.port == null) {
        options.port = DANMU_PORT_3PARTY;
    }

    var socket = net.connect(options);
    return new DanmuSocket(socket, options.roomId, options.groupId);
};

module.exports = DanmuConnection;
