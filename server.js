var config = require('./config')
var express = require('express')
var http = require('http')
var url = require('url')
var websocket = require('websocket-stream')
var Devices = require('./lib/devices')

var app = express()
var devices = new Devices(config)
var httpServer = http.createServer()

websocket.createServer({server: httpServer}, handleWebsocket)

app.use(express.static('.build'))
app.use(express.static('public'))

app.get('/device', function (req, res, next) {
  devices.list().then(function (json) {
    res.json(json)
  }).catch(next)
})

function handleWebsocket (ws) {
  var location = url.parse(ws.socket.upgradeReq.url, true)

  if (location.path.indexOf('/device/') === 0) {
    var deviceId = location.path.split('/').slice(2).join('/')

    devices.addConnection(deviceId, ws).catch(function (err) {
      console.error(err.stack || err.message)

      ws.close()
    })
  } else {
    ws.close()
  }
}

httpServer.on('request', app)

httpServer.listen(3000, function () {
  console.log('Listening on ' + httpServer.address().port)
})
