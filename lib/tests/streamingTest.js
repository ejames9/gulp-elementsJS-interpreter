
/*
Tests for gulp-elementsJS-interpreter, gulp plugin
Author: Eric James Foster
*/

var elems = require('../index.js'),
      log = require('elements.js'),
  rawBody = require('raw-body'),
   assert = require('assert'),
     File = require('vinyl'),
      vfs = require('vinyl-fs'),
       fs = require('fs');


describe('gulp-elementsJS-interpreter', function() {
  describe('in streaming mode', function() {

    it('should find elements syntax and replace it with vanilla JavaScript', function(fin) {
      //Create vinyl file object from elements.js in filesystem.
      var stream,
          output = fs.readFileSync(__dirname + '/output.js/elements.js', 'utf8'),
          sFile;
          //  input = fs.readFileSync(__dirname + '/elements.js', 'utf8'),
          //   file = new File( {contents: new Buffer(input)} );
      //Create transformation stream.
      stream = elems();
      //Write input file to stream.
      vfs.src('./elements.js').pipe(stream);
      //Once file comes out......
      stream.once('data', function(file) {
        //Make sure it is still a stream.....
        assert(file.isStream());
        //Compare contents against ideal output file....
        rawBody(file, 'utf8', function(req, res) {
          sFile = res;
          log(sFile, ['red', 'bold']);
        });
        assert.equal(sFile, output);
        fin();
      });
    });
  });
});
