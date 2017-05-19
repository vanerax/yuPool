const douyu = require('./douyu');
const SMPlayer = require('./SMPlayer');
const constant = require('../common/constant');
const EventEmitter = require('events');
const readline = require('readline');

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



var ee = new EventEmitter();

ee.on('newListener', function(evt, listener){ // triggerred when on is called
      console.log('newListener', arguments);
});
ee.on('myevt', function(evt){

   console.log(evt);
});

ee.emit('myevt', {x:1, y:2});


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// rl.question('What do you think of Node.js? ', (answer) => {
//   // TODO: Log the answer in a database
//   console.log(`Thank you for your valuable feedback: ${answer}`);

//   //rl.close();
// });
//console.log("prompt:");

rl.prompt();
rl.on('line', (line) => {
  console.log(`Received: ${line}`);
  //console.log("prompt:");
  rl.prompt();
});
rl.write('test write\n');
//var mw = new MyWritable();
//console.log(MyWritable);
//
var buff = [];
process.stdin.on('data', function(chunk){
   var s = chunk.toString();
   var pos = s.indexOf('\n');
   if ( pos > -1 ) {
      var line = buff.join('') + s.slice(0, pos);
      console.log(line);

      buff = [];
      buff.push(s.slice(pos+1));
   } else {
      buff.push(s);
   }
   
});
