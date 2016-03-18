

var gulp = require('gulp'),
   mocha = require('gulp-mocha');



gulp.task('default', ()=> {
  var testFiles = './lib/test/*.js';

  return gulp.src(testFiles)
    .pipe(mocha( {reporter: 'nyan'} ));
});
