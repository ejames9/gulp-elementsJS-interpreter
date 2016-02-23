
/*
Tests for gulp-elementsJS-interpreter, gulp plugin
Author: Eric James Foster
*/

var elems = require('../index.js'),
   assert = require('assert'),
     File = require('vinyl'),
      vfs = require('vinyl-fs'),
       fs = require('fs');


describe('gulp-elementsJS-interpreter', function() {
  describe('in buffer mode', function() {

    it('should find elements.js syntax and replace it with vanilla JavaScript', function(fin) {
      //Create vinyl file object from elements.js in filesystem.
      var stream,
          output = fs.readFileSync(__dirname + '/output.js/elements.js', 'utf8'),
           input = fs.readFileSync(__dirname + '/elements.js', 'utf8'),
            file = new Buffer(input);
      //Create transformation stream.
      stream = elems();
      //Write input file to stream.
      stream.write(file);
      //Once file comes out......
      stream.once('data', function(file) {
        //Make sure it is still a buffer.....
        assert(file.isBuffer());
        //Compare contents against ideal output file....
        assert.equal(file.contents.toString('utf8'), output);
        fin();
      });
    });
  });
});
