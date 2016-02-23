
/*
Tests for gulp-elementsJS-interpreter, gulp plugin
Author: Eric James Foster
*/

var elems = require('../index.js'),
  rawBody = require('raw-body'),
   assert = require('assert'),
     File = require('vinyl'),
      vfs = require('vinyl-fs'),
       es = require('event-stream'),
       fs = require('fs');


describe('gulp-elementsJS-interpreter', function() {
  describe('in streaming mode', function() {

    it('should find illegal elements.js syntax and replace it with legal elements.js JavaScript', function(fin) {
      //Create vinyl file object from elements.js in filesystem.
      var stream,
          output = fs.readFileSync(__dirname + '/output.js/elements.js', 'utf8');

      //Create transformation stream.
      stream = elems();
      //Write input file to stream.
      vfs.src(__dirname + '/elements.js', {buffer: false} )
                                                    .pipe(stream);
      //Once file comes out......
      stream.once('data', function(file) {
        //Make sure it is still a stream.....
        assert(file.isStream());
        //Compare contents against ideal output file....
        file.contents.pipe(es.wait(function(err, data) {
          assert.equal(data, output);
          fin();
        }));
      });
    });
  });
});
