
/*
bufferTest.js

Buffer mode test for gulp-elementsJS-interpreter, gulp plugin
Author: Eric James Foster
*/

var gulpElementsInterpreter = require('../../index.js'),
                     assert = require('assert'),
                       File = require('vinyl'),
                        log = require('elementsJS').log,
                         fs = require('fs');


describe('gulp-elementsJS-interpreter', function() {
  describe('in buffer mode', function() {

    it("should parse file for 'illegal' elements.js syntax sugar, and replace it with 'legal' elements.js alias functions", function(fin) {
      /*Allocate memory for the stream, the input file and the correct output file. Convert input file to Buffer
      Vinyl File Object.*/
      var stream,
          output = fs.readFileSync(__dirname + '/output.js/elemsTest.js', 'utf8'),
           input = fs.readFileSync(__dirname + '/elemsTest.js', 'utf8'),
            file = new File( {contents: new Buffer(input)} );
      //Create transformation stream.
      stream = gulpElementsInterpreter();
      //Write input file to stream.
      stream.write(file);
      //Once file comes out......
      stream.once('data', function(file) {
        //Make sure it is still a buffer.....
        assert(file.isBuffer());
        //Compare contents against ideal output file....
        assert.equal(file.contents.toString('utf8'), output);      log(file.contents.toString('utf8'), ['green', 'bold']);
        fin();
      });
    });
  });
});
