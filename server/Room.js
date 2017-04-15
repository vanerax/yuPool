const client = require('./Client.js');

function Room(name) {
	this.aClients = [];
}
Room.prototype.pushClient = function(oClient) {
	this.aClients.push(oClient);
};

Room.prototype.popClient = function() {
	//for (var i=0;i<this.aClients[0];i++) {
	return this.aClients.pop();
	//}	
};

Room.prototype.getClients = function() {
	return this.aClients;
};

module.exports = Room;