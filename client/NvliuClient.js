const BaseClient = require('./BaseClient');
const constant = require('../common/constant');
const util = require('util');

function NvliuClient() {
	BaseClient.call(this, constant.NVLIU_NAME, constant.NVLIU_ROOM_ID);
}
util.inherits(NvliuClient, BaseClient);

module.exports = NvliuClient;
