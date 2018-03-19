
/*
streamingTest.js

Streaming mode test for gulp-elementsJS-interpreter, gulp plugin
Author: Eric James Foster
*/

var gulp_____Plugin = require('../../index.js'),
             assert = require('assert'),
                vfs = require('vinyl-fs'),
                 es = require('event-stream'),
                 fs = require('fs');


describe('gulp-_____', function() {
  describe('in streaming mode', function() {

    it("should ", function(fin) {
      //Create vinyl file object from elements.js in filesystem.
      var stream,
          output = fs.readFileSync(__dirname + '/IO/------.js', 'utf8');

      //Create transformation stream.
      stream = gulp_____Plugin();
      //Write input file to stream.
      vfs.src(__dirname + '/IO/------.js', {buffer: false} )
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
