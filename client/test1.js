const douyu = require('./douyu');
const SMPlayer = require('./SMPlayer');
const constant = require('../common/constant');
const fs =require('fs');
const Writable = require('stream').Writable;
const Downloader = require('./Downloader');

class MyWritable extends Writable {
  constructor(options) {
    super(options);
  }

  _write(chunk, encoding, callback) {
    if (chunk.toString().indexOf('a') >= 0) {
      callback(new Error('chunk is invalid'));
    } else {
      callback();
    }
  }
}


var url = "https://www.baidu.com/";
var ws = fs.createWriteStream('r:\\z.txt', { highWaterMark: 64 * 1024 });
Downloader.runWriteStream(url, ws);

