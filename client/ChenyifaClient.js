const BaseClient = require('./BaseClient');
const constant = require('../common/constant');
const util = require('util');

function ChenyifaClient() {
	BaseClient.call(this, constant.CHENYIFA_NAME, constant.CHENYIFA_ROOM_ID);
}
util.inherits(ChenyifaClient, BaseClient);

module.exports = ChenyifaClient;
