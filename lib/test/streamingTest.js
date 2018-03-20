
/*
streamingTest.js

Streaming mode test for gulp-elementsJS-interpreter, gulp plugin
Author: Eric James Foster
*/

var gulpElementsInterpreter = require('../../index.js'),
                     assert = require('assert'),
                        vfs = require('vinyl-fs'),
                        log = require('elementsJS').log,
                         es = require('event-stream'),
                         fs = require('fs');


describe('gulp-elementsJS-interpreter', function() {
  describe('in streaming mode', function() {

    it("should parse file for 'illegal' elements.js syntax sugar, and replace it with 'legal' elements.js alias functions", function(fin) {
      //Create vinyl file object from elements.js in filesystem.
      var stream,
          output = fs.readFileSync(__dirname + '/IO/elemsTestOutput.js', 'utf8');

      //Create transformation stream.
      stream = gulpElementsInterpreter();
      //Write input file to stream.
      vfs.src(__dirname + '/IO/elemsTestInput.js', {buffer: false} )
                                                    .pipe(stream);
      //Once file comes out......
      stream.once('data', function(file) {
        //Make sure it is still a stream.....
        assert(file.isStream());
        //Compare contents against ideal output file....
        file.contents.pipe(es.wait(function(err, data) {
          assert.equal(data, output);                             log(data, ['green', 'bold']);
          fin();
        }));
      });
    });
  });
});
