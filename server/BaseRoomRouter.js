const express = require('express');
const Client = require('./Client');
const roomManager = require('./RoomManager');

var PARAM_NAME = "name";

function BaseRoomRouter(name){
    this.name = name;
    //this.oRoom = new Room(name);
    //oRooms[this.name] = this.oRoom;
}

BaseRoomRouter.prototype.create = function() {
    var self = this;
    var router = express.Router();
    //router.get('/' + this.name, function(){ fGetHandler.apply(self, arguments); });
    //router.post('/' + this.name, function(){ fPostHandler.apply(self, arguments); });
    router.get('/:' + PARAM_NAME, function(){ fGetHandler.apply(self, arguments); });
    router.post('/:' + PARAM_NAME, function(){ fPostHandler.apply(self, arguments); });
    return router;
};

BaseRoomRouter.create = function(name) {
    var baseRouter = new BaseRouter(name);
    return baseRouter.create();
}

// callback
function fGetHandler(req, res) {
    var self = this;
    var roomName = req.params[PARAM_NAME];
    console.log(`>> one client joined to ${roomName}`);
    var client = Client.create(req, res);
    roomManager.join(client, roomName);
}

function fPostHandler(req, res) {
    var self = this;
    var roomName = req.params[PARAM_NAME];
    console.log(`>> ${roomName} broadcast`);

    function broadcast(data){
        // pop all clients
        var oClient = roomManager.popClient(roomName);
        while (oClient) {
            console.log('client!');
            oClient.response.send(data);

            oClient = roomManager.popClient(roomName);
        }
    }

    var rawData = '';
    req.on('data', function(chunk){
        rawData += chunk;
    });
    req.on('end', function(){
        res.send('ok');

        broadcast(rawData);
    });
}



module.exports = BaseRoomRouter;