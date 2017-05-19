const fs = require('fs');
const child_process = require('child_process');

var ffmpeg = "E:\\Program Files (x86)\\FFQueue\\ffmpeg.exe";
var sBasePath = "E:\\temp\\dyReplay\\";
var sFileName = "playlist.m3u8";
var sTS = sBasePath + "output.ts";
var sMP4 = "F:\\Video\\nvliu\\output.mp4";


function readFromPlaylist(sFileName) {
	//console.log(sFileName);
	var sPayload = fs.readFileSync(sFileName, 'utf8');
	//console.log(sPayload);
	var aRawLine = sPayload.split('\n');
	var aLine = aRawLine.filter(function(line){
		return line.length > 0 && line[0] != '#';
	});

	return aLine;
}

function getFileNameFromList(aLine) {
	var i = 0;
	return aLine.map(function(line){
		return `${sBasePath}${i++}.ts`;
	});
	
}

function copy(fOnComplete) {
	// check if copy is finished
	if (idx >= aFiles.length) {
		ws.end();
		convertToMP4();
		// if (fOnComplete) {
		// 	fOnComplete();
		// }
		return;
	}

	var rs = fs.createReadStream(aFiles[idx], { highWaterMark: 1024 * 1024 });
	rs.on('data', function(chunk){
		if (false === ws.write(chunk)) {
			//console.log("ws pause");
			rs.pause();
		}
	});

	rs.on('end', function(){
		console.log(`${idx} OK!`);
		idx++;
		copy();
	});

	ws.on('drain', function(){
		//console.log("ws resume");
		rs.resume();
	});
}

function convertToMP4() {
	var ffmpegParams = ["-i", sTS, "-vcodec", "copy", "-acodec", "copy", "-bsf", "aac_adtstoasc", sMP4];
	var oProc = child_process.spawn(ffmpeg, ffmpegParams);
	oProc.stdout.on('data', (data) => {
	  console.log(`stdout: ${data}`);
	});

	oProc.stderr.on('data', (data) => {
	  console.log(`stderr: ${data}`);
	});

	oProc.on('close', (code) => {
	  console.log(`child process exited with code ${code}`);
	});
}


var idx = 0;
var aFiles = getFileNameFromList(readFromPlaylist(sBasePath + sFileName));

//var ws = fs.createWriteStream(sTS, { highWaterMark: 1024 * 1024 });
// copy();

convertToMP4();
