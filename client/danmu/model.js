
var model = {};

function Message() {

}

// @return {Object}
Message.parse = function(sData){
    var oMsg = {};
    sData.split('/').forEach(function(item){
        
        var aToken = item.split('@=');
        if (2 == aToken.length) {
            var key = aToken[0].replace('@S', '/').replace('@A', '@');
            var val = aToken[1].replace('@S', '/').replace('@A', '@');
            oMsg[key] = val;
        }
    });
    return oMsg;
};

// @return {String}
Message.generate = function(obj) {
    var aMsg = [];
    for (var e in obj) {
        var key = e.replace('/', '@S').replace('@', '@A');
        var val = obj[e];
        if (typeof val == 'string') {
            val = val.replace('/', '@S').replace('@', '@A');
        }
        aMsg.push(key + "@=" + val + "/");
    }
    return aMsg.join('');
};

function Payload() {}

/*
 * struct {
 *   int len;
 *   int code;
 *   char magic[4];
 *   char content[0]; // string with zero end
 * }
 * // total length = 4 + 4 + 4 + len(content) + 1
 * // len field = 4 + 4 + len(content) + 1
 *
 * @return {Buffer}
 */
Payload.generate = function(sMsg) {
    var buffLength = new Buffer(4);
    buffLength.writeInt32LE(sMsg.length + 9);

    var buffCode = buffLength;
    var buffMagic = new Buffer([0xb1, 0x02, 0x00, 0x00]);
    var buffContent = new Buffer(sMsg);
    var buffEnd = new Buffer([0x00]);
    return Buffer.concat([buffLength, buffCode, buffMagic, buffContent, buffEnd]);
}

/*
 * parse payload return content list
 * @return {Array<String>}
 */
Payload.parse = function(bufData){
    var nLenToProc = bufData.length; 
    var bufCurrent = bufData;

    if (bufData.length > nLength + 4) {
        // contains multiple messages
    } else if (bufData.length < bufLength + 4) {
        throw new Error("unexpected buffer");
    }

    var aContent = [];
    while (nLenToProc > 0) {
        var nLength = bufCurrent.readInt32LE();
        // get content buffer
        var bufContent = bufCurrent.slice(4 + 8, 4 + nLength - 1);
        aContent.push(bufContent);

        bufCurrent = bufCurrent.slice(4 + nLength);
        nLenToProc -= 4 + bufLength;
    }

    return aContent;
}

model.Message = Message;
model.Payload = Payload;
module.exports = model;
