/*
type@=loginres/userid@=1301506724/roomgroup@=0/pg@=0/sessionid@=1756992563/username@=visitor956724/nickname@=visitor956724/live_stat@=1/is_illegal@=0/ill_ct@=/ill_ts@=0/now@=1492358019/ps@=0/es@=0/it@=0/its@=0/npv@=0/best_dlev@=0/cur_lev@=0/nrc@=0/ih@=0/
*/
const assert = require('assert');
const model = require('../danmu/model');
const DanmuPayload = require('../DanmuPayload');
const Message = model.Message;

(function() {
   var data = 'type@=loginres/userid@=1301506724/roomgroup@=0/pg@=0/sessionid@=1756992563/username@=visitor956724/nickname@=visitor956724/live_stat@=1/is_illegal@=0/ill_ct@=/ill_ts@=0/now@=1492358019/ps@=0/es@=0/it@=0/its@=0/npv@=0/best_dlev@=0/cur_lev@=0/nrc@=0/ih@=0/';
   var oMsg = Message.parse(data);
   assert.equal(oMsg.type, "loginres");
   assert.equal(oMsg.userid, "1301506724");
   assert.strictEqual(oMsg.roomgroup, "0");
   assert.equal(oMsg.sessionid, "1756992563");

   var sMsg = Message.generate(oMsg);
   //console.log(sMsg);
   assert.equal(sMsg, data);

})();


(function(){
   var msg1 = 'type@=loginres/userid@=1301506724/roomgroup@=0/pg@=0/sessionid@=1756992563/username@=visitor956724/nickname@=visitor956724/live_stat@=1/is_illegal@=0/ill_ct@=/ill_ts@=0/now@=1492358019/ps@=0/es@=0/it@=0/its@=0/npv@=0/best_dlev@=0/cur_lev@=0/nrc@=0/ih@=0/';
   var buff1 = model.Payload.generate(msg1);
   var msg2 = 'type@=chatmsg/rid@=301712/gid@=-9999/uid@=123456/nn@=test/txt@=666/level@=1/';
   var buff2 = model.Payload.generate(msg2);

   var danmuPayload = new DanmuPayload();
   danmuPayload.push(buff1);
   danmuPayload.push(buff2);
   
   assert.equal(danmuPayload.shift(), msg1);
   assert.equal(danmuPayload.shift(), msg2);
})();





console.log("test ok");




