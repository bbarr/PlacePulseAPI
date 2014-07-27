var gulp = require('gulp')
var gutil = require('gulp-util')
var exec = require('child_process').exec

gulp.task('test:units', function() {
  exec('NODE_ENV=test mocha test/units/ --colors --recursive --compilers coffee:coffee-script/register --reporter spec', function(e, stdout, stderr) {
    gutil.log(stdout, stderr) 
  })
})

gulp.task('test:functional', function() {
  var debug = (process.argv[process.argv.length - 1] == '--debug')
  exec('NODE_ENV=test mocha test/functional' + (debug ? ' --debug --debug-brk ' : ' ') + '--recursive --colors --compilers coffee:coffee-script/register --reporter spec', function(e, stdout, stderr) {
    gutil.log(stdout, stderr)
  })
})

