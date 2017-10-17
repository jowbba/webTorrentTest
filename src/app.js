var path = require('path')
var fs = require('fs')
var WebTorrent = require('webtorrent')
var client = new WebTorrent()
var Schedule = require('./schedule')
var schedule = new Schedule()

var magnet = 'magnet:?xt=urn:btih:975a12da9b266113ba162620f8c0c68189deab31&dn=Despicable.Me.3.2017.1080p.WEBRip.x264.AAC2.0-SHITBOX&xl=-181621437&tr=http://tracker.trackerfix.com:80/announce&tr=udp://9.rarbg.me:2710/announce&tr=udp://9.rarbg.to:2710/announce'
var torrentPath = path.normalize('E:\\下载\\【BT吧】[1080p]-神偷奶爸3-卑鄙的我3-坏蛋奖门人3(港)-3.83GB.torrent')
var magnet2 = 'magnet:?xt=urn:btih:82f6dfe67037d87945a636d6d64d23c7622389bc&dn=Transformers.The.Last.Knight.2017.1080p.WEB-DL.DD5.1.H264-FGT&xl=2082908362&tr=http://tracker.trackerfix.com:80/announce&tr=udp://9.rarbg.me:2710/announce&tr=udp://9.rarbg.to:2710/announce'
var torrentPath2 = path.normalize('E:\\下载\\【BT吧】[1080p]-变形金刚5：最后的骑士-变形金刚：终极战士(港)-变形金刚5：最终骑士(台)-5.94GB.torrent')

var torrentBuffer = fs.readFileSync(torrentPath)
var torrentBuffer2 = fs.readFileSync(torrentPath2)


client.on('torrent', () => {
	console.log('client trigger torrent ')
})

client.on('error', err => {
	console.log('client trigger error')
})


var tempPath = path.normalize('E:\\webTorrentTest\\temp')
// schedule.addTorrent(torrentPath, downloadPath)
let torrentId = schedule.addMagnet(magnet2, tempPath)
setTimeout(() => {
	console.log('begin pause')
	schedule.pause(torrentId)
},30000)

setTimeout(() => {
	console.log('begin resume')
	schedule.resume(torrentId)
},60000)

setInterval(() => {
	console.log(schedule.getSummary(), schedule.getFinish())
},4000)


return
client.add(torrentBuffer, (torrent) => {
	let con = () => {
		console.log(' ')
		console.log(' ')
		console.log('torrent infoHash: ' + torrent.infoHash)
		console.log('torrent magnetURI: ' + torrent.magnetURI)
		// console.log('torrent torrentFile: ' + torrent.torrentFile)
		console.log('torrent timeRemaining: ' + torrent.timeRemaining)
		console.log('torrent received: ' + torrent.received)
		console.log('torrent downloaded: ' + torrent.downloaded)
		console.log('torrent uploaded: ' + torrent.uploaded)
		console.log('torrent downloadSpeed: ' + torrent.downloadSpeed)
		console.log('torrent uploadSpeed: ' + torrent.uploadSpeed)
		console.log('torrent progress: ' + torrent.progress)
		console.log('torrent ratio: ' + torrent.ratio)
		console.log('torrent numPeers: ' + torrent.numPeers)
		console.log('torrent path: ' + torrent.path)
	}

	let cfile = () => {
		torrent.files.forEach(file => {
			console.log('')
			console.log('file name: ' + file.name)
			console.log('file path: ' + file.path)
			console.log('file length: ' + file.length)
			console.log('file downloaded: ' + file.downloaded)
			console.log('file progress: ' + file.progress)
		})
		
	}
	let mkv = torrent.files.find(item => item.name.endsWith('mkv'))
	let txt = torrent.files.find(item => item.name.endsWith('txt'))

	setTimeout(() => {
		txt.deselect()
		mkv.deselect()
		console.log('1')
	}, 21000)

	setTimeout(() => {
		txt.select()
		mkv.select()
		console.log('2')
	}, 61000)

	torrent.on('infoHash', () => {
		console.log('torrent trigger infoHash')
	})

	torrent.on('metadata', () => {
		console.log('torrent trigger metadata')
	})

	torrent.on('ready', () => {
		console.log('torrent trigger ready')
	})

	torrent.on('warning', (warning) => {
		console.log('torrent trigger warning ： ' + warning)
	})

	torrent.on('error', () => {
		console.log('torrent trigger error')
	})

	torrent.on('done', () => {
		console.log('torrent trigger done') 
			cfile()
	})

	torrent.on('download', (bytes) => {
		// console.log('torrent trigger download')
	})

	torrent.on('upload', (bytes) => {
		// console.log('torrent trigger upload')
	})

	torrent.on('wire', (wire, addr) => {
		// console.log('torrent trigger wire ' + addr)
	})

	torrent.on('noPeers', (announceType) => {
		console.log('torrent trigger noPeers')
	})

	setInterval(() => {
		// con()
		cfile()
	},20000)


	// setTimeout(() => {
	// 	torrent.destroy(() => {
	// 		console.log(torrent, 'destroy')
	// 	},10000)	
	// })
})





