var util = require('util')
var Readable = require('stream').Readable

function Multimeter (options) {
  Readable.call(this)

  this._readableState.objectMode = true

  this.options = options || {}
  this.options.units = this.options.units || ['A', 'Ohm', 'Volt']
  this.options.interval = this.options.interval || 500

  this.unitIndex = 0
  this.timestamp = (new Date()).valueOf()
  this.sequence = 1
  this.value = 0
}

util.inherits(Multimeter, Readable)

Multimeter.prototype._read = function () {
  var self = this

  var next = function () {
    var now = (new Date()).valueOf() - self.options.interval

    if (self.timestamp > now) {
      setTimeout(next, self.options.interval)
    } else {
      while (self.timestamp <= now) {
        self.pushMeasurement()
      }
    }
  }

  next()
}

Multimeter.prototype.pushMeasurement = function () {
  if (Multimeter.gaussianRandom(-0.75, 0.5) > 0) {
    this.unitIndex = (this.unitIndex + 1) % this.options.units.length
  }

  var measurement = {
    timestamp: this.timestamp,
    sequence: this.sequence,
    value: this.value,
    unit: this.options.units[this.unitIndex]
  }

  this.timestamp += 500
  this.sequence++
  this.value += Multimeter.gaussianRandom(0.0, 0.25) * 100

  this.push(measurement)
}

Multimeter.gaussianRandom = function (mean, stdev) {
  var x1
  var x2
  var w

  do {
    x1 = 2.0 * Math.random() - 1.0
    x2 = 2.0 * Math.random() - 1.0
    w = x1 * x1 + x2 * x2
  } while (w >= 1.0)

  w = Math.sqrt((-2.0 * Math.log(w)) / w)

  return mean + stdev * x1 * w
}

module.exports = Multimeter
