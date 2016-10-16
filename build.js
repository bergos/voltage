/* global cp, exec, mkdir */

require('shelljs/global')

mkdir('-p', '.build')
mkdir('-p', '.build/css')
mkdir('-p', '.build/fonts')
mkdir('-p', '.build/js')

cp('node_modules/bootstrap/dist/css/bootstrap.min.css', '.build/css/')
cp('node_modules/bootstrap/dist/css/bootstrap.min.css.map', '.build/css/')
cp('node_modules/bootstrap/dist/fonts/*', '.build/fonts/')
cp('node_modules/bootstrap/dist/js/bootstrap.min.js', '.build/js/')

cp('node_modules/highcharts/highcharts.js', '.build/js/')
cp('node_modules/highcharts/highcharts-more.js', '.build/js/')
cp('node_modules/highcharts/modules/solid-gauge.js', '.build/js/')

cp('node_modules/jquery/dist/jquery.min.js', '.build/js/')
cp('node_modules/jquery/dist/jquery.min.map', '.build/js/')

exec('browserify -d lib/app.js > .build/js/app.js')
