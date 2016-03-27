var gulp = require('gulp')
var mocha = require('gulp-mocha')

gulp.task('default', ['firefox'])

function run() {
  return gulp.src('test/**/*.js', {read: false})
    .pipe(mocha())
    .once('error', function (err) {
      console.error('%s: %s', err.plugin, err.message)
      process.exit(1)
    })
    .once('end', function () {
      process.exit()
    })
}

var browsers = [
  'firefox',
  'chrome',
  'phantomjs',
  'MicrosoftEdge',
  'ie',
  'opera']
browsers.forEach(function (b) {
  gulp.task(b, function () {
    process.env.SELENIUM_BROWSER = b
    return run()
  })
})