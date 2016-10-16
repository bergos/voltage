/* global $, Highcharts */

var defaults = require('lodash/defaults')

function LoggerGraph (container, options) {
  this.container = container
  this.options = defaults(LoggerGraph.defaultOptions, options)

  this.options.deviceChange(this.onDeviceChange.bind(this))

  Highcharts.setOptions({
    global: {
      useUTC: false
    }
  })

  $(this.container).highcharts({
    chart: {
      animation: Highcharts.svg,
      marginRight: 10
    },
    title: null,
    xAxis: {
      type: 'datetime',
      tickPixelInterval: 150
    },
    yAxis: {
      plotLines: [{
        value: 0,
        width: 1,
        color: '#808080'
      }]
    },
    tooltip: {
      formatter: function () {
        return Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' + this.y
      }
    },
    legend: {
      enabled: false
    },
    exporting: {
      enabled: false
    },
    series: [{
      data: []
    }],
    credits: {
      enabled: false
    }
  })

  this.chart = $(this.container).highcharts()
}

LoggerGraph.prototype.onDeviceChange = function (device) {
  var self = this

  device.on('data', function (chunk) {
    var data = JSON.parse(chunk.toString())

    if (self.unit() !== data.unit) {
      self.clear()
    }

    self.unit(data.unit)
    self.add(data.timestamp, data.value)
  })
}

LoggerGraph.prototype.unit = function (unit) {
  if (unit !== undefined) {
    this.chart.yAxis[0].setTitle({text: unit})
  }

  return this.chart.yAxis[0].axisTitle.textStr
}

LoggerGraph.prototype.add = function (timestamp, value) {
  var shift = this.chart.series[0].data.length >= this.options.samples

  this.chart.series[0].addPoint([timestamp, value], true, shift)

  // always show 0
  var extreme = this.chart.yAxis[0].getExtremes()
  var min
  var max

  if (extreme.dataMin > 0 && extreme.dataMax > 0) {
    min = 0
  } else if (extreme.dataMin < 0 && extreme.dataMax < 0) {
    max = 0
  }

  this.chart.yAxis[0].setExtremes(min, max, true, false)
}

LoggerGraph.prototype.clear = function () {
  while (this.chart.series[0].data.length) {
    this.chart.series[0].removePoint(0)
  }
}

LoggerGraph.defaultOptions = {
  samples: 20
}

module.exports = LoggerGraph
