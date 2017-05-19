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


function DanmuConnection() {}

function DanmuSocket(socket, roomId, groupId) {
    var self = this;
    this._socket = socket;
    this._roomId = roomId;
    this._groupId = groupId;
    this._eventEmitter = new EventEmitter();
    this._heartbeat = new DanmuHeartbeat(this._socket);
    this._danmuPayload = new DanmuPayload();

    this._socket.on('connect', function() {
        self._login();
    });

    this._socket.on('data', function(chunk) {
        //var aMsg = model.Payload.parse(chunk);
        this._danmuPayload.push(chunk);
        var aMsg = this._danmuPayload.shiftAll();

        aMsg.forEach(function(sMsg){
            var oMsg = model.Message.parse(sMsg);
            this.eventEmmiter.emit('data', oMsg);
            // translate message
            this._translateMessage(oMsg);
        });
        
    });

    this._socket.on('end', function(){
        this.eventEmmiter.emit('end');
        console.log('disconnected from server');
        this._socket.end();
    });
}

DanmuSocket.prototype.end = function() {};

DanmuSocket.prototype.write = function(sMsg) {
    var bufPayload = model.Payload.generate(sMgs);
    this._socket.write(bufPayload);
};

DanmuSocket.prototype._translateMessage = function(oMsg) {
    // TODO
    if (oMsg.type && oMsg.type.length > 0) {
        this._eventEmitter.emit(oMsg.type, oMsg);
    }

    switch (oMsg.type) {
    case 'loginres':
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
        username: "visitor1234567",
        password: "1234567890123456",
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
    if (this._heartbeatHandler == null) {
        this._heartbeatHandler = setInterval(function(){
            var now = Math.floor(new Date().getTime() / 1000);
            var oMsg = {
                type: "keeplive",
                tick: now
            };
            this._danmuSocket.write(model.generate(oMsg));
            console.log("send heartbeat...");
        }, HEARTBEAT_INTERVAL * 1000);
    }
};
DanmuHeartbeat.prototype.stop = function() {
    if (this._heartbeatHandler) {
        removeInterval(this._heartbeatHandler);
        this._heartbeatHandler = null;
    }
};

DanmuConnection.connect = function(options) {
    if (options.roomId == null) {
        throw new Error("roomId not specified");
    }
    if (options.groupId == null) {
        throw new Error("groupId not specified");
    }

    var socket = net.connect(options);
    return new DanmuSocket(socket, options.roomId, options.groupId);
};

module.exports = DanmuConnection;
