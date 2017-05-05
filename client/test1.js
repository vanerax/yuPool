const douyu = require('./douyu');
const SMPlayer = require('./SMPlayer');
const constant = require('../common/constant');
const fs =require('fs');
const Writable = require('stream').Writable;

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

var mw = new MyWritable();
console.log(MyWritable);

mw.write("hello world", function(){
    console.log('written for my writeable');
    console.log(arguments);
});

var ws = new fs.createWriteStream('z.txt');
ws.on('open', function(){
    console.log('open');
    console.log(arguments);
});
ws.on('close', function(){
    console.log('close');
    console.log(arguments);
});

ws.on('finish', function(){
    console.log('finish');
    console.log(arguments);
});

ws.on('error', function(){
    console.log('error');
    console.log(arguments);
});

var bRet = ws.write("test1", function(){
    console.log('written1');
    console.log(arguments);
});
console.log(bRet);

bRet = ws.write("test2", function(){
    console.log('written2');
    console.log(arguments);
});
console.log(bRet);

//process.stdin.pipe(ws);

ws.end();
