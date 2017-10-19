var path = require('path')
var fs = require('fs')
var WebTorrent = require('webtorrent')
var client = new WebTorrent()
var Schedule = require('./schedule')

var magnet = 'magnet:?xt=urn:btih:975a12da9b266113ba162620f8c0c68189deab31&dn=Despicable.Me.3.2017.1080p.WEBRip.x264.AAC2.0-SHITBOX&xl=-181621437&tr=http://tracker.trackerfix.com:80/announce&tr=udp://9.rarbg.me:2710/announce&tr=udp://9.rarbg.to:2710/announce'
var torrentPath = path.normalize('E:\\下载\\【BT吧】[1080p]-神偷奶爸3-卑鄙的我3-坏蛋奖门人3(港)-3.83GB.torrent')
var magnet2 = 'magnet:?xt=urn:btih:82f6dfe67037d87945a636d6d64d23c7622389bc&dn=Transformers.The.Last.Knight.2017.1080p.WEB-DL.DD5.1.H264-FGT&xl=2082908362&tr=http://tracker.trackerfix.com:80/announce&tr=udp://9.rarbg.me:2710/announce&tr=udp://9.rarbg.to:2710/announce'
var torrentPath2 = path.normalize('E:\\下载\\【BT吧】[1080p]-变形金刚5：最后的骑士-变形金刚：终极战士(港)-变形金刚5：最终骑士(台)-5.94GB.torrent')
var magnet3 = 'magnet:?xt=urn:btih:cbae4561e51f2742736e77372b33f386903be581&dn=%E3%80%90BT%E5%90%A7-www.btba.com.cn%E3%80%91%E4%BE%A0%E7%9B%97%E8%81%94%E7%9B%9F.The+Adventurers.2017.1080p%E5%9B%BD%E7%B2%A4%E5%8F%8C%E8%AF%AD%E4%B8%AD%E8%8B%B1%E5%8F%8C%E5%AD%97.BTBA&xl=1787794052&tr=http://tracker.btba.cc:6060/announce&tr=udp://explodie.org:6969/announce&tr=udp://mgtracker.org:2710/announce&tr=udp://9.rarbg.com:2720/announce&tr=udp://shadowshq.yi.org:6969/announce&tr=udp://shadowshq.eddie4.nl:6969/announce&tr=udp://tracker.coppersurfer.tk:6969/announce&tr=http://tracker2.wasabii.com.tw:6969/announce&tr=udp://eddie4.nl:6969/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://tracker.leechers-paradise.org:6969/announce'

var torrentBuffer = fs.readFileSync(torrentPath)
var torrentBuffer2 = fs.readFileSync(torrentPath2)


client.on('torrent', () => {
	console.log('client trigger torrent ')
})

client.on('error', err => {
	console.log('client trigger error')
})
var id 

var tempPath = path.normalize('E:\\webTorrentTest\\temp')
let downloadPath = path.normalize('E:\\下载')
var schedule = new Schedule(tempPath)
// schedule.addTorrent(torrentPath, downloadPath).then(data => {
// 	id = data
// })
// schedule.addMagnet(magnet2, downloadPath)
// schedule.addMagnet(magnet3, downloadPath)
setTimeout(() => {
	// console.log('begin pause')
	// schedule.pause(torrentId)
	// schedule.destory(id)
},30000)

setTimeout(() => {
	// console.log('begin resume')
	// schedule.resume(torrentId)
},60000)

setInterval(() => {
	console.log(schedule.getSummary())
},5000)





