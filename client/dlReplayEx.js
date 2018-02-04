const Downloader = require('./Downloader');
const fs = require('fs');

// playlist.m3u8

var sRawUrl = "http://videows1.douyucdn.cn/live/high_643129820171029194400-upload-0225/playlist.m3u8?k=528ad9bd49fe2563a19107961b1ddc02&t=5a75f86d&u=70806189&ct=web&vid=1793645&d=9C9B29EE0C9EA895F06C92FDADC800ED";
var sBaseUrl = "";
var sPlayList = "";
var sBasePath = "E:\\temp\\dyReplay\\";
var sFileName = "playlist.m3u8";
var output = sBasePath + "output.ts";

function parseUrl() {
	var nPos = sRawUrl.indexOf("playlist.m3u8");
	sBaseUrl = sRawUrl.slice(0, nPos);
	sPlayList = sRawUrl.slice(nPos);
	console.log(sBaseUrl);
	console.log(sPlayList);
}

function getBaseUrl() {
	return sBaseUrl;
}

function getPlayList(sUrl, fOnGetPlayList) {
	Downloader.runWriteBuffer(sUrl, (bfData)=>{
		var aLine = bfData.toString().split('\n');
		verifyPlayList(aLine);
		aLine = aLine.filter(function(line){
			return line.length > 0 && line[0] != '#';
		});
		fOnGetPlayList(aLine);
	});
}

function verifyPlayList(aList) {
	if (aList[0] != "#EXTM3U") {
		throw "PlayList unexpected";
	}
}

function downloadAll(aUrlList, oWriteStream, fDone, nMaxThread) {
	
	var sIdx = 0;
	var oBufferPool = {};
	var aBufferIdx = [];
	nMaxThread = nMaxThread || 1;

	function run() {
		console.log('start <run> ' + sIdx);
		var sCurIdx = sIdx;
		if (sCurIdx >= aUrlList.length) {
			if (aBufferIdx.length > 0) {
				// havs remaining tasks
				console.log('wait for renaming jobs');
			} else {
				// all done
				console.log('all done');
				fDone();
			}
			return;
		}

		if (aBufferIdx.length >= nMaxThread) {
			console.log('thread limited');
			return;
		}

		aBufferIdx.push(sCurIdx);

		var sUrl = getBaseUrl() + aUrlList[sCurIdx];
		Downloader.runWriteBuffer(sUrl, (bfData) => {
			oBufferPool[sCurIdx] = bfData;

			console.log('task ' + sCurIdx + ' ok');
			tryWriteStream();
			runMost();
			// // check count
			// if (aBufferIdx.indexOf(sCurIdx) === 0) {
			// 	oWriteStream.write(oBufferPool[sCurIdx]);
			// 	delete oBufferPool[sCurIdx];
			// 	aBufferIdx.splice(0, 1);

			// 	while (aBufferIdx.length > 0) {
			// 		var nNextIdx = aBufferIdx[0];
			// 		if (oBufferPool[nNextIdx]) {
			// 			oWriteStream.write(oBufferPool[nNextIdx]);
			// 			delete oBufferPool[nNextIdx];
			// 			aBufferIdx.splice(0, 1);
			// 		} else {
			// 			break;
			// 		}
			// 	}

			// } else {
			// 	// do nothing
			// }

		});

		console.log(sIdx);
		console.log(aBufferIdx);
		sIdx++;
	}

	function tryWriteStream() {
		while (aBufferIdx.length > 0) {
			var nNextIdx = aBufferIdx[0];
			if (oBufferPool[nNextIdx]) {
				oWriteStream.write(oBufferPool[nNextIdx]);
				delete oBufferPool[nNextIdx];
				aBufferIdx.splice(0, 1);
			} else {
				break;
			}
		}
	}

	function runMost() {
		if (aBufferIdx.length === nMaxThread) {
			console.log('thread limited');
		}

		while (aBufferIdx.length < nMaxThread) {
			run();
		}
	}

	runMost();
}

function onPlaylistComplete() {
	var sPayload = fs.readFileSync(sBasePath + sFileName, 'utf8');
	var aLine = sPayload.split('\n');
	var lineIdx = 0;
	var videoIdx = 0;


	verifyPlayList(aLine);
	aLine = aLine.filter(function(line){
		return line.length > 0 && line[0] != '#';
	});

	function getVideo() {

		if (lineIdx < aLine.length) {
			var line = aLine[lineIdx];
			lineIdx++;
			console.log(line);

			//if (line.length > 0 && line[0] != '#') {
				var sUrl = sBaseUrl + line;
				var sFileName = sBasePath + videoIdx.toString() + ".ts";
				console.log(sFileName);
				console.log('-----------');
				//Downloader.run(sUrl, sFileName, onVideoComplete);
				Downloader.runWriteStream(sUrl, writeStream, onVideoComplete);
				
				videoIdx++;
	
			//} else {
			//	setTimeout(getVideo, 0);
			//}
			

		} else {
			// finished
			writeStream.end();
		}
	} 

	function onVideoComplete(){
		getVideo();
	}


	
	var writeStream = fs.createWriteStream(output, { highWaterMark: 1024 * 1024 });
	getVideo();
}



if (sRawUrl && sRawUrl.length > 0) {
	parseUrl();
}
getPlayList(sBaseUrl + sPlayList, function(aList){
	//console.log(aList);
	var nMaxThread = 3;
	var oWriteStream = fs.createWriteStream(output, { highWaterMark: 1024 * 1024 });
	downloadAll(aList, oWriteStream, () => {
		oWriteStream.end();
	}, nMaxThread);
});


