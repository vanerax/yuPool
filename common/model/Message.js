
function Message(roomId, body) {
	this.roomId = roomId;
	this.body = body;
}

Message.prototype.toJSON = function() {
	return JSON.stringify(this);
};

Message.prototype.fromJSON = function(json) {
	var oMsg = JSON.parse(json);
	this.roomID = oMsg.roomId;
	this.body = oMsg.body;
};

module.exports = Message;
