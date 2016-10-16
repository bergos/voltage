function Devices (options) {
  var self = this

  this.options = options
  this.connections = {}

  Object.keys(this.options.devices).forEach(function (deviceId) {
    var device = self.options.devices[deviceId]

    self.connections[deviceId] = []

    device.on('data', function (data) {
      self.connections[deviceId].forEach(function (connection) {
        connection.write(JSON.stringify(data))
      })
    })

    device.on('end', function () {
      self.connections[deviceId].forEach(function (connection) {
        connection.end()
      })
    })

    device.on('error', function (err) {
      console.error(err.stack || err.message)

      self.connections[deviceId].forEach(function (connection) {
        connection.end()
      })
    })
  })
}

Devices.prototype.list = function () {
  var devices = {}

  Object.keys(this.options.devices).forEach(function (deviceId) {
    devices[deviceId] = {}
  })

  return Promise.resolve(devices)
}

Devices.prototype.addConnection = function (deviceId, connection) {
  var self = this

  this.connections[deviceId].push(connection)

  connection.on('close', function () {
    self.connections[deviceId].splice(self.connections[deviceId].indexOf(connection), 1)
  })

  return Promise.resolve()
}

module.exports = Devices
