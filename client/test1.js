const douyu = require('./douyu');
const SMPlayer = require('./SMPlayer');
const constant = require('../common/constant');

var sPayload = 
    "did=9C9B29EE0C9EA895F06C92FDADC800ED&cdn=ws&ver=2017040801&sign=10440fcf0baefcaf156dad0611d37e96&tt=24864006&rate=2";
douyu.getPlay(210486, sPayload, function(sUrl){
    var player = new SMPlayer();
    player.play(sUrl);
})