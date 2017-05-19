const EventEmitter = require('events');

const MAX_BUFFER_LEN = 1024 * 1024;

function DanmuPayload() {
    this._eventEmitter = new EventEmitter();
    this._aBuffer = [];
}

// shift one message from payload
// @return {String}. return null if not available
DanmuPayload.prototype.shift = function() {
    var ret = null;

    if (this._aBuffer.length == 0) {
        return null;
    }

    var tmpBuffer;
    if (this._aBuffer.length > 1) {
        tmpBuffer = Buffer.concat(this._aBuffer);
    } else if (this._aBuffer.length === 1){
        tmpBuffer = this._aBuffer[0];
    }

    if (tmpBuffer > MAX_BUFFER_LEN) {
        throw new Error("buffer size excceeds the maxmium threshold");
    }

    if (tmpBuffer.length >= 4 + 8 + 1) {
        var nLen = tmpBuffer.readInt32LE();
        if (tmpBuffer.length >= 4 + nLen) {
            var content = tmpBuffer.slice(4 + 8, 4 + nLen - 1);

            ret = content.toString();

            if (tmpBuffer.length > 4 + nLen) {
                var newBuffer = tmpBuffer.slice(4 + nLen);
                this._aBuffer = [ newBuffer ];
            } else {
                this._aBuffer = [];
            }
            

        } else {
            // no enough data filled
            ret = null;
        }
    } else {
        // no enough data filled
        ret = null;
    }

    return ret;
};

DanmuPayload.prototype.shiftAll = function() {
    var aRet = [];
    var content = this.shift();
    while (content) {
        aRet.push(content);
        content = this.shift();
    }
    if (aRet.length > 1) {
        console.log(`>> multiple messages contained! `);
        console.log(aRet);
    }

    return aRet;
};

DanmuPayload.prototype.push = function(chunk) {
    this._aBuffer.push(chunk);
};

module.exports = DanmuPayload;

