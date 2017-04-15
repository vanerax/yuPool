const Room = require('./Room');

var oRooms = {};

function RoomManager() {

}
RoomManager.prototype.join = function(client, roomId) {
    if (null == oRooms[roomId]) {
        oRooms[roomId] = new Room(roomId);
    }
    oRooms[roomId].pushClient(client);
};

RoomManager.prototype.popClient = function(roomId) {
    var client = null;
    if (oRooms[roomId]) {
        client = oRooms[roomId].popClient();
    }
    return client;
};

var roomManger = new RoomManager();

module.exports = roomManger;
