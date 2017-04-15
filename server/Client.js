

function Client(request, response) {
	this.request = request;
	this.response = response;
}

//Client.prototype.join = function(roomId) {

//};

/*
 * factory method
 */
Client.create = function(request, response) {
	return new Client(request, response);
};

module.exports = Client;