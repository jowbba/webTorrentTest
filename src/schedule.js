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
		this.downloading = []
		this.downloaded = []
		this.log = function() {
			let infoHash = this.infoHash
			let timeRemaining = this.timeRemaining
			let downloaded = this.downloaded
			let downloadSpeed = this.downloadSpeed
			let progress = this.progress
			let numPeers = this.numPeers
			let path = this.path
			let state = this.state
			let name = this.name
			return {infoHash, timeRemaining, downloaded, downloadSpeed, progress, numPeers, path, name}
		}
	}

	addTorrent(torrentPath, path) {
		if (!fs.existsSync(torrentPath)) throw new Error('torrent file not exist')
		let torrentBuffer = fs.readFileSync(torrentPath)
		return this.createTorrent(torrentBuffer, path, torrentPath)
	}

	addMagnet(magnetURL, path) {
		if (typeof magnetURL !== 'string' || magnetURL.indexOf('magnet') == -1) throw new Error('magnetURL is not a legal magnetURL')
		return this.createTorrent(magnetURL, path)
	}

	createTorrent(t, path, torrentPath) {
		let torrent = this.client.add(t, {path})
		torrent.log = this.log
		torrent.state = 'downloading'
		torrent.torrentPath = torrentPath?torrentPath:null
		torrent.magnetURL = torrentPath?null:t
		this.cache()
		torrent.on('done', () => {
			console.log('torrent done trigger ' + torrent.progress)
			if (torrent.progress !== 1) return
			torrent.destroy(() => {
				let index = this.downloading.indexOf(torrent)
				if (index == -1) throw new Error('torrent is not exist in downloading array')
				this.downloading.splice(index,1)
				this.downloaded.push(torrent)
				this.cache()
				console.log('torrent destory success')
				console.log(this.downloading.length + ' -- ' + this.downloaded.length)
			})
		})
		this.downloading.push(torrent)
		return torrent.infoHash
	}

	pause(torrentId) {
		let torrent = this.client.get(torrentId)
		if (!torrent) return {code: -1}
		torrent.files.forEach(file => {file.deselect()})

	}

	resume(torrentId) {
		let torrent = this.client.get(torrentId)
		if (!torrent) return {code: -1}
		torrent.files.forEach(file => {file.select()})		
	}

	getSummary(torrentId) {
		if (torrentId) {
			if (typeof torrentId !== 'string' || torrentId.length < 1) throw new Error('torrentId is not legal')
			let result = this.client.get(torrentId)
			if (!result) return []
			else return [result.log()]
		}else {
			return this.downloading.map(torrent => torrent.log() )
		}
	}

	getFinish() {
		return this.downloaded.map(file => file.log())
	}

	cache() {
		console.log('begin cache ...')
		let obj = {
			downloading: this.downloading.map(file => file.log()),
			downloaded: this.downloaded.map(file => file.log())
		}

		console.log(obj)
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