var path = require('path')
var fs = require('fs')
var { EventEmitter } = require('events')
var WebTorrent = require('webtorrent')


class Schedule extends EventEmitter {
	constructor(tempPath) {
		super()
		this.tempPath = tempPath
		this.catchPath = path.join(this.tempPath, 'storage.json')
		this.client = new WebTorrent()
		// this.client.on('torrent', this.newTorrent)
		this.client.on('error', this.clientError)
		this.downloading = []
		this.downloaded = []
		this.writing = false
		this.number = 0
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
			let torrentPath = this.torrentPath
			let magnetURL = this.magnetURL
			return {infoHash, timeRemaining, downloaded, downloadSpeed, progress, numPeers, path, name, torrentPath, magnetURL}
		}
		this.init()
	}

	init() {
		if (!fs.existsSync(this.catchPath)) return 
		let tasks = JSON.parse(fs.readFileSync(this.catchPath))
		this.downloaded = tasks.downloaded
		tasks.downloading.forEach(file => {
			if (file.torrentPath) this.addTorrent(file.torrentPath, file.path)
			else if (file.magnetURL) this.addMagnet(file.magnetURL, file.path)
		})
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

	async createTorrent(t, path, torrentPath) {
		let torrent = this.client.add(t, {path})
		torrent.log = this.log
		torrent.state = 'downloading'
		torrent.torrentPath = torrentPath?torrentPath:null
		torrent.magnetURL = torrentPath?null:t
		torrent.on('done', () => {
			console.log('torrent done trigger ' + torrent.progress)
			if (torrent.progress !== 1) return
			torrent.destroy(async () => {
				let index = this.downloading.indexOf(torrent)
				if (index == -1) throw new Error('torrent is not exist in downloading array')
				this.downloading.splice(index,1)
				this.downloaded.push(torrent)
				await this.cache()
				console.log('torrent destory success')
				console.log(this.downloading.length + ' -- ' + this.downloaded.length)
			})
		})
		if (this.downloading.findIndex(item => item.infoHash == torrent.infoHash) !== -1) return console.log('torrent exist now')
		this.downloading.push(torrent)
		await this.cache()
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
		return new Promise((resolve,reject) => {
			if (this.writing) {
				console.log('schedule is writing catche now, waiting...')
				this.lockNumber++
				resolve()
			}

			console.log('begin cache ...')
			this.lockNumber = 0
			this.writing = true
			let obj = {
				downloading: this.downloading.map(file => file.log()),
				downloaded: this.downloaded.map(file => file.log())
			}
			fs.writeFile(this.catchPath, JSON.stringify(obj,null, '\t'), err => {
				this.writing = false
				if (err) {
					console.log('cache tasks failed')
					reject(err)
				}
				else {
					console.log('cache tasks success')
					if (this.lockNumber > 0) {
						console.log('exist writing task todo')
						this.cache()
					}
					resolve()
				}
			})
		})
	}

	destory(torrentId) {
		
	}

	clientError() {

	}
}


module.exports = Schedule