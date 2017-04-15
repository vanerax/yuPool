const child_process = require('child_process');
const exec = require('child_process').exec;

var sExeName = "C:\\Program Files (x86)\\SMPlayer\\SMPlayer.exe";
//var sExeName = "C:\\Program Files (x86)\\K-Lite Codec Pack\\MPC-HC64\\mpc-hc64.exe";


function SMPlayer() {
	
}

SMPlayer.prototype.exec = function(aParams, oOptions, fCallback) {
	aParams = aParams || [];
	oOptions = oOptions || {};
	child_process.execFile(sExeName, aParams, oOptions, fCallback);
};

SMPlayer.prototype.play = function(sUrl) {
	child_process.spawn(sExeName, [ sUrl ]);
};

module.exports = SMPlayer;
