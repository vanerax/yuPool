const Downloader = require('./Downloader');
const fs = require('fs');

var sBaseUrl = "http://videows1.douyucdn.cn/live/normal_643129820170503174440-upload-fc99/";
var sPlayList = "playlist.m3u8?k=18b7161e61ca12bb89049b29e71510b8&t=590b47f2&u=70806189&ct=web&vid=594678&d=9C9B29EE0C9EA895F06C92FDADC800ED";
var sBasePath = "E:\\temp\\dyReplay\\";
var sFileName = "playlist.m3u8";

function getPlaylist(sUrl, sFileName, fOnComplete) {
	Downloader.run(sUrl, sFileName, fOnComplete);
}


function onPlaylistComplete() {
	var sPayload = fs.readFileSync(sBasePath + sFileName, 'utf8');
	var aLine = sPayload.split('\n');
	var lineIdx = 0;
	var videoIdx = 0;

	function getVideo() {

		if (lineIdx < aLine.length) {
			var line = aLine[lineIdx];
			lineIdx++;
			console.log(line);

			if (line.length > 0 && line[0] != '#') {
				var sUrl = sBaseUrl + line;
				var sFileName = sBasePath + videoIdx.toString() + ".ts";
				console.log(sFileName);
				Downloader.run(sUrl, sFileName, onVideoComplete);
				videoIdx++;
	
			} else {
				setTimeout(getVideo, 0);
			}
			

		} else {
			// finished
		}
	} 

	function onVideoComplete(){
		getVideo();
	}

	getVideo();
}

//Downloader.run(sUrl, sFileName, onComplete);

getPlaylist(sBaseUrl + sPlayList, sBasePath + sFileName, onPlaylistComplete);
