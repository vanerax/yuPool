const child_process = require('child_process');
const exec = require('child_process').exec;

var sExeName = "C:\\Program Files (x86)\\SMPlayer\\SMPlayer.exe";
//var sExeName = "C:\\Program Files (x86)\\K-Lite Codec Pack\\MPC-HC64\\mpc-hc64.exe";
var sUrl = "http://hdl3.douyucdn.cn/live/67373rmcqvx1K6yw_900.flv?wsAuth=42376bfd55265d7c15a71d6f970aaec2&token=web-douyu-0-67373-3ccda2f7b9d5241df3f812d58eb8d9a1&logo=0&expire=0&did=9C9B29EE0C9EA895F06C92FDADC800ED&ver=2017033101";
//exec(sExeName + " " + sUrl);


function Player() {
	
}

Player.prototype.exec = function(aParams, oOptions, fCallback) {
	aParams = aParams || [];
	oOptions = oOptions || {};
	child_process.execFile(sExeName, aParams, oOptions, fCallback);
};

module.exports = Player;