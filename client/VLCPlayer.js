const child_process = require('child_process');
const exec = require('child_process').exec;

var sExeName = "C:\\Program Files (x86)\\VideoLAN\\VLC\\vlc.exe";
//var sExeName = "C:\\Program Files (x86)\\K-Lite Codec Pack\\MPC-HC64\\mpc-hc64.exe";


function VLCPlayer() {
	
}

VLCPlayer.prototype.exec = function(aParams, oOptions, fCallback) {
	aParams = aParams || [];
	oOptions = oOptions || {};
	child_process.execFile(sExeName, aParams, oOptions, fCallback);
};

VLCPlayer.prototype.play = function(sUrl) {
	child_process.spawn(sExeName, [ sUrl ]);
};

module.exports = VLCPlayer;
