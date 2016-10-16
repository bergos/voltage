/* global $, Highcharts */

var defaults = require('lodash/defaults')

function Gauge (container, options) {
  var self = this

  this.container = container
  this.options = defaults(Gauge.defaultOptions, options)

  this.options.deviceChange(this.onDeviceChange.bind(this))

  $(this.container).highcharts(Highcharts.merge(this.options, {
    chart: {
      type: 'solidgauge'
    },
    credits: {
      enabled: false
    },
    pane: {
      center: ['50%', '85%'],
      size: '140%',
      startAngle: -90,
      endAngle: 90,
      background: {
        backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
        innerRadius: '60%',
        outerRadius: '100%',
        shape: 'arc'
      }
    },
    plotOptions: {
      solidgauge: {
        dataLabels: {
          y: 5,
          borderWidth: 0,
          useHTML: true
        }
      }
    },
    series: [{
      name: ' ',
      data: [0],
      dataLabels: {
        formatter: function () {
          var value = (this.y && self.inverse ? '-' : '') + Gauge.formatNumber(this.y, self.options.precision)

          return '<div style="text-align:center"><span style="font-size:25px;color:' +
            ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">' + value + '</span><br/>' +
            '<span style="font-size:12px;color:silver">' + this.series.name + '</span></div>'
        },
        y: -50
      }
    }],
    title: null,
    tooltip: {
      enabled: false
    },
    yAxis: {
      minColor: '#55BF3B',
      lineWidth: 0,
      minorTickInterval: null,
      tickAmount: 2,
      title: {
        y: -70
      },
      min: 0,
      max: 10,
      labels: {
        formatter: function () {
          return (this.value && self.inverse ? '-' : '') + this.value
        },
        y: 16
      }
    }
  }))

  this.chart = $(this.container).highcharts()
}

Gauge.prototype.onDeviceChange = function (device) {
  var self = this

  device.on('data', function (chunk) {
    var data = JSON.parse(chunk.toString())

    var max = Math.pow(10, Math.ceil(Math.log10(Math.abs(data.value))))

    self.inverse = data.value < 0

    self.unit(data.unit)
    self.range(0, max)
    self.value(data.value)
  })
}

Gauge.prototype.unit = function (unit) {
  if (unit !== undefined) {
    this.chart.series[0].name = unit
  }

  return this.chart.series[0].name
}

Gauge.prototype.range = function (min, max) {
  this.chart.yAxis[0].setExtremes(min, max)
}

Gauge.prototype.value = function (value) {
  if (value !== undefined) {
    this.chart.series[0].points[0].update(Math.abs(value))
  }

  return this.chart.series[0].points[0].y
}

Gauge.formatNumber = function (value, precision) {
  var div = Math.pow(10, precision - Math.ceil(Math.log10(value)))

  return Math.floor(value * div + 0.5) / div
}

Gauge.defaultOptions = {
  precision: 4
}

module.exports = Gauge
