const express = require('express');
const BaseRoomRouter = require('./BaseRoomRouter');
const constant = require('../common/constant');

var app = express();
app.set("view engine","jade");
//app.set('views', __dirname + '/views');

app.use("/", express.static("public"));

//app.get('/', function (req, res) {
//  res.send('Hello World!');
//  //res.render("index",{"title":"test"}); 
//});


// var fengtimoRouter = new BaseRoomRouter(constant.FENGTIMO_NAME).create();
// app.use('/api', fengtimoRouter);
// console.log('room router registered for fengtimo');

// var nvliuRouter = new BaseRoomRouter(constant.NVLIU_NAME).create();
// app.use('/api', nvliuRouter);
// console.log('room router registered for nvliu');

//app.get('/api/:roomId', function(req, res){
//	console.log(req.params);
//	res.end();
//});

var baseRoomRouter = new BaseRoomRouter().create();
app.use('/api', baseRoomRouter);
console.log('room router registered for /api/:roomName');

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});