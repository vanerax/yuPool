const BaseClient = require('./BaseClient');
const FengtimoClient = require('./FengtimoClient');
const NvliuClient = require('./NvliuClient');
const ChenyifaClient = require('./ChenyifaClient');
const constant = require('../common/constant');
const douyu = require('./douyu');
const SMPlayer = require('./SMPlayer');

var onMessage = function(oData, oContext) {
    console.log(oData);
    console.log(oContext);
    var sRoomId = oContext.sRoomId;
    var sPayload = oData;

    console.log(sRoomId);
    console.log(sPayload.toString());
    // douyu.getPlay(sRoomId, sPayload, function(sUrl){
    //  var player = new SMPlayer();
    //  player.play(sUrl);
    // });
};

var oFengtimo = new FengtimoClient();
oFengtimo.onMessage = onMessage;
oFengtimo.start();

// var oNvliu = new NvliuClient();
// oNvliu.onMessage = onMessage;
// oNvliu.start();

// var oChenyifa = new ChenyifaClient();
// oChenyifa.onMessage = onMessage;
// oChenyifa.start();

// var oClient = new BaseClient(constant.XIAOQINGMIAO_NAME, constant.XIAOQINGMIAO_ROOM_ID);
// oXiaoqingmiao.onMessage = onMessage;
// oXiaoqingmiao.start();

