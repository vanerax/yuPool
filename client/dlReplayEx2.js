const Downloader = require('./Downloader');
const fs = require('fs');

// playlist.m3u8
const MAX_DOWNLOAD_THREAD = 4;
var sRawUrl = "http://videows1.douyucdn.cn/live/high_643129820180425203333-upload-ece6/playlist.m3u8?k=1456358d3ba73e8272de0bb43a54b8f7&t=5b647f6f&u=70806189&ct=web&vid=3870837&pt=1&cdn=ws&d=2d1149d79179e4c521e1407370061501";
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
	var aJobIdx = [];
	var aBufferIdx = [];
	nMaxThread = nMaxThread || 1;

	function run() {
		// console.log('start job ' + sIdx + '. appending to [' + aJobIdx + "]");
		var sCurIdx = sIdx;
		if (sCurIdx >= aUrlList.length) {
			if (aJobIdx.length > 0) {
				// havs remaining tasks
				console.log('wait for remaining jobs');
			} else {
				// all done
				console.log('all done');
				fDone();
			}
			return;
		}

		if (aJobIdx.length >= nMaxThread) {
			console.log('thread limited');
			return;
		}

		aJobIdx.push(sCurIdx);
		aBufferIdx.push(sCurIdx);
		inspectQueue(aJobIdx, aBufferIdx);

		var sUrl = getBaseUrl() + aUrlList[sCurIdx];
		Downloader.runWriteBuffer(sUrl, (bfData) => {
			oBufferPool[sCurIdx] = bfData;
			aJobIdx.splice(aJobIdx.indexOf(sCurIdx), 1);

			// console.log('job ' + sCurIdx + ' ok');
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

		sIdx++;
	}

	function tryWriteStream() {
		// console.log(">> buffer [" + aBufferIdx + "]");
		var ok = true;
		while (aBufferIdx.length > 0 && ok) {
			var nNextIdx = aBufferIdx[0];
			if (oBufferPool[nNextIdx]) {
				ok = oWriteStream.write(oBufferPool[nNextIdx]);
				delete oBufferPool[nNextIdx];
				aBufferIdx.splice(0, 1);
			} else {
				break;
			}
		}
		if (aBufferIdx.length > 0 && !ok) {
			//console.log('>> wait for drain!!!!!!!!!!!!!!!!!!!!!!!!!');
			oWriteStream.once('drain', tryWriteStream);
		}
		
	}

	function runMost() {
		// if (aBufferIdx.length === nMaxThread) {
		// 	console.log('thread limited');
		// }

		// while (aBufferIdx.length < nMaxThread && sIdx < aUrlList.length) {
		// 	run();
		// }
		var n = nMaxThread - aJobIdx.length; // Math.min(nMaxThread - aJobIdx.length, nMaxBuffer - aBufferIdx.length)
		for (var i=0; i< n; i++) {
			run();
		}
	}

	runMost();
}

function inspectQueue(aJobIdx, aBufferIdx) {
	var aOutput = [];

	for (var i=0;i<aBufferIdx.length;i++) {
		var nIdx = aBufferIdx[i];
		var sPrefix = "";
		if (aJobIdx.indexOf(nIdx) > -1) {
			sPrefix = "*";
		}
		aOutput.push(sPrefix + nIdx);
	}

	console.log("[ ", aOutput.join(", ") + " ]");
}

if (sRawUrl && sRawUrl.length > 0) {
	parseUrl();
}

getPlayList(sBaseUrl + sPlayList, function(aList){
	//console.log(aList);
	var oWriteStream = fs.createWriteStream(output, { highWaterMark: 1024 * 1024 });
	downloadAll(aList, oWriteStream, () => {
		oWriteStream.end();
	}, MAX_DOWNLOAD_THREAD);
});
