const url = require('url');
const http = require('http');
const https = require('https');


var server = http.createServer((req, res) => {
   console.log("response: ");
   console.log(req.headers);
   res.end();
   server.close();
});
server.listen(8088);





var sUrl = "http://localhost:8088/lapi/live/getPlay/";// + ROOM_ID;

var oUrl = url.parse(sUrl);

var oOption = {
   hostname: oUrl.hostname,
   port: oUrl.port,
   path: oUrl.path,
   method: 'POST',
   headers: { }
      //"User-Agent": "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36",
      //"Content-Type": "application/x-www-form-urlencoded" }
};

var sBody = "123";//TOKEN;
oOption.headers["content-length"] = sBody.length;
console.log(`get video url from: ${sUrl}`);
//console.log(oOption);
var oReq = http.request(oOption, function(res){

  let rawData = '';
  res.on('data', function(chunk){
      rawData += chunk;
  });
  res.on('end', function(){
      //console.log(rawData);
      if (res.statusCode != 200) {
          console.log(rawData.toString());
          throw "error! status code = " + res.statusCode;
      }
      //cbNext(rawData, cbNext2);
  });
});
oReq.write(sBody);
oReq.end();