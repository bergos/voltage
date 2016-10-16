var RandomMultimeter = require('./lib/random-multimeter')
// var UT61E = require('ut61e')

var config = {
  devices: {
    'random': new RandomMultimeter()
    /* 'ut61e': new UT61E({
      he2335u: {
        path: '/home/bergi/Projects/c/ut61e_cpp/he2325u/he2325u'
      },
      es51922: {
        path: '/home/bergi/Projects/c/ut61e_cpp/es51922/es51922'
      }
    }) */
  }
}

module.exports = config
