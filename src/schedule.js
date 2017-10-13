var path = require('path')
var fs = require('fs')
var { EventEmitter } = require('events')
var WebTorrent = require('webtorrent')


class Schedule extends EventEmitter {
	constructor() {
		super()
		this.client = new WebTorrent()
		this.client.on('torrent', this.newTorrent)
		this.client.on('error', this.clientError)
		this.tasks = []
		this.log = function() {
			let infoHash = this.infoHash
			let timeRemaining = this.timeRemaining
			let downloaded = this.downloaded
			let downloadSpeed = this.downloadSpeed
			let progress = this.progress
			let numPeers = this.numPeers
			let path = this.path
			let state = this.state
			return {infoHash, timeRemaining, downloaded, downloadSpeed, progress, numPeers, path}
		}
	}

	addTorrent(torrentPath, path) {
		if (!fs.existsSync(torrentPath)) throw new Error('torrent file not exist')
		let torrentBuffer = fs.readFileSync(torrentPath)
		return this.createTorrent(torrentBuffer, path)
	}

	addMagnet(magnetURL, path) {
		if (typeof magnetURL !== 'string' || magnetURL.indexOf('magnet') == -1) throw new Error('magnetURL is not a legal magnetURL')
		return this.createTorrent(magnetURL, path)
	}

	createTorrent(t, p) {
		let torrent = this.client.add(t, {p})
		torrent.test = this.log
		torrent.state = 'downloading'
		return torrent.infoHash
	}

	pause(torrentId) {

	}

	resume(torrentId) {

	}

	getSummary(torrentId) {
		if (typeof torrentId !== 'string' || torrentId.length < 1) throw new Error('torrentId is not legal')
		let arr = []
		if (torrentId) {
			let result = this.client.get(torrentId)
			if (!result) return []
			else arr.push(result)
		}
		return arr.map(item => item.test())

	}

	getTorrent(torrentId) {

	}

	destory(torrentId) {

	}

	newTorrent() {

	}

	clientError() {

	}

	log() {
		setInterval(() => {

		}, 1000)
	}
}


module.exports = Schedule