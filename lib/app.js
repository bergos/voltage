var fetch = require('isomorphic-fetch')
var websocket = require('websocket-stream')
var Event = require('crab-event').Event
var Gauge = require('./gauge')
var LoggerGraph = require('./logger-graph')

var app = {}

app.events = {
  deviceChange: new Event()
}

app.gauge = new Gauge('#gauge', {
  deviceChange: app.events.deviceChange.on
})

app.loggerGraph = new LoggerGraph('#logger-graph', {
  deviceChange: app.events.deviceChange.on
})

app.devices = function () {
  return fetch('/device').then(function (res) {
    if (res.status !== 200) {
      throw new Error('couldn\'t fetch device list')
    }

    return res.json()
  })
}

function init () {
  return app.devices().then(function (devices) {
    var deviceId = Object.keys(devices).shift()
    var device = websocket('ws://' + window.location.host + '/device/' + deviceId)

    return app.events.deviceChange.trigger(device)
  })
}

init().catch(function (err) {
  console.error('couldn\'t load multimeter list:' + (err.stack || err.message))
})
