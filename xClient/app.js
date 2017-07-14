const url = require('url');
const http = require('http');
const assert = require('assert');
const Player = require('./player');
const child_process = require('child_process');
const fs = require('fs');

var ROOM_ID = "156277"; //2089340,490977
var TOKEN = 
    "cptl=0001&ver=2017070701&rate=2&tt=24993206&cdn=tct&sign=37f786964fc951af335c0efe3f7bb3c6&did=9C9B29EE0C9EA895F06C92FDADC800ED";

function step1(cbNext) {
    var sUrl = "https://www.douyu.com/swf_api/room/67373?cdn=ws&nofan=yes&_t=24850898&sign=9c0251729e77f02c31f0dfa06ce5607d";

    var oUrl = url.parse(sUrl);
    var oOption = {
        hostname: oUrl.hostname,
        //port: 80,
        path: oUrl.path,
        method: 'GET',
        headers: {}
    };

    http.request(oOption, function(res){
        assert.ok(res instanceof http.IncomingMessage, "IncomingMessage");

        let rawData = '';
        res.on('data', function(chunk){
            rawData += chunk;
        });
        res.on('end', function(){
            console.log(rawData);
            cbNext(rawData);
        });
    }).end(); // return <http.ClientRequest>

    //console.log(oUrl);
    //console.log(url.format(oUrl));
}

function step2(cbNext, cbNext2) {
    var sUrl = "https://www.douyu.com/lapi/live/getPlay/" + ROOM_ID;

    var oUrl = url.parse(sUrl);

    var oOption = {
        hostname: oUrl.hostname,
        //port: 80,
        path: oUrl.path,
        method: 'POST',
        headers: {}
    };

    var sBody = TOKEN;
    var oReq = http.request(oOption, function(res){
        if (res.statusCode != 200) {
            throw "error! status code = " + res.statusCode;
            //return;
        }

        let rawData = '';
        res.on('data', function(chunk){
            rawData += chunk;
        });
        res.on('end', function(){
            //console.log(rawData);
            cbNext(rawData, cbNext2);
        });
    });
    oReq.write(sBody);
    oReq.end();
}

function getUrlFromStep2(sData, cbNext2) {
    //console.log(sData);
    var oData = JSON.parse(sData);
    try{
        //var sBaseUrl = "http://hdl3.douyucdn.cn/live/";
        var sUrl = oData.data.rtmp_url + "/" + oData.data.rtmp_live;

        console.log(sUrl);

        cbNext2(sUrl);
    } catch (ex) {
        console.error(ex);
    }
    return sUrl;
}

function play(sUrl) {
    var player = new Player();
    player.exec([sUrl], {}, function(error, stdout, stderr){
        if (error != null) {
            console.log(error);
        }
    });
}

function saveToFile(sUrl) {
    var sFilePath = "r:\\douyu.txt";
    fs.writeFileSync(sFilePath, sUrl);
    openFile(sFilePath);
}

function openFile(sFilename) {
    child_process.spawn("notepad.exe", [ sFilename ]);
}

function wget(sUrl) {
    var wgetFileName = "e:\\Utils\\wget.exe";
    var targetFileName = "e:\\temp\\" + Math.floor(new Date().getTime() / 1000) + ".flv";
    var wgetOptions = [ "-O", targetFileName, sUrl ];
    //var sFilePath = "e:\\Utils\\wget.exe -O " + filename;

    var owget = child_process.spawn(wgetFileName, wgetOptions);
    owget.stdout.on('data', (data) => {
        console.log(data.toString());
    });

    owget.stderr.on('data', (data) => {
        console.error(data.toString());
    });

    owget.on('close', (code) => {
        if (code !== 0) {
            console.log(`wget process exited with code ${code}`);
        }
    });
}

if (process.argv.length >= 4) {
    ROOM_ID = process.argv[2];
    TOKEN = process.argv[3];
    console.log(`room id = ${ROOM_ID}`);
    console.log(`token = ${TOKEN}`);
}


//step1(step2, getUrlFromStep2);
step2(getUrlFromStep2, play);
//step2(getUrlFromStep2, function(sUrl){ saveToFile(sUrl); });
step2(getUrlFromStep2, wget);
