const BaseClient = require('./BaseClient');
const constant = require('../common/constant');
const util = require('util');

function FengtimoClient() {
	BaseClient.call(this, constant.FENGTIMO_NAME, constant.FENGTIMO_ROOM_ID);
}
util.inherits(FengtimoClient, BaseClient);

module.exports = FengtimoClient;
