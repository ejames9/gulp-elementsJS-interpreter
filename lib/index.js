//var r = /^import\(\{\s*([\'\"][\w\W]+[\'\"]\s?\:\s*\[\s*([\'\"][\w\W]+[\'\"])?([\'\"]\w+[\'\"]\s*\,?\s*)*[\'\"]\w+[\'\"]\s*\]\s*\,?\s*)+\}\)\;/g;
'use_strict';

//es6 imports
var _ = require('./helpers');
var log = require('elements.js').log;

//node modules
var fs = require('fs');
var RawSource = require('webpack-sources').RawSource;





var ElementsInterpreter = function(file) {
  var list,
      codeBlock = [],
      codeString,
      appendPoint,
      source = file || './import.js';



  var _convertModulesObjectToCodeBlock = function(obj) {
    codeBlock = ['///Begin Module requires///\n \n'];
    codeString = '';
    for (var key in obj) {
      if (obj[key] !== null && Array.isArray(obj[key])) {
        codeString = 'var ' + key + ' = require("' + key + '");\n';
        codeBlock.push(codeString);
        for (var i = 0; i < obj[key].length; i++) {
          codeString = 'var ' + obj[key][i] + ' = ' + key + '.' + obj[key][i] + '; \n';
          codeBlock.push(codeString);
          if (i === obj[key].length - 1) {
            codeBlock.push('    \n');
          }
        }
      } else if (obj[key] !== null) {
        codeString = 'var ' + obj[key] + ' = require("' + key + '");\n';
        codeBlock.push(codeString);
        codeBlock.push('     \n');
      } else {
        codeString = 'var ' + key + ' = require("' + key + '");\n';
        codeBlock.push(codeString);
        codeBlock.push('     \n');
      }
    }
    codeBlock.push('///End Module requires///\n \n');

    return new RawSource(codeBlock.join(''));
  };



  var _parseFileForImportFunction = function(doc) {
    this.o = null;
    this.p = null;

    var getFuncRE = /import\(\{\s*.*\n?([^})]*\n?)*\}\)\;/im,
         getObjRE = /\{\s*.*\n?([^})]*\n?)*\}/im;

    var newFile = doc.toString();
       log(getFuncRE.test(newFile));
       if (getFuncRE.test(newFile)) {
         while (getFuncRE.test(newFile)) {
           var l = getFuncRE.exec(newFile),
               m = l[0],
               n = getObjRE.exec(m);

/*ignore jslint start*/

          this.o = n[0];
           var formOfEvil = new Function('this.p = ' + this.o + ';');
           formOfEvil();      //Used function constructor to convert extracted object into object code.

           var newCode = _convertModulesObjectToCodeBlock(this.p);
               newCode = newCode._value;
               newFile = newFile.replace(getFuncRE, newCode);

         }
       } else {
         log('No matches found.');
       }
    return newFile;
  };

/*ignore jslint end*/

  var _parseFileForElementsSyntax = function(file) {
    var newFile, code;
    var m, n, en, o, p  = [];

    var getElementsRE = /(<(['"]?[.#]?(\w+.?)+<?['"]?=?)+(\s?\/>)+)+/,
          getStringRE = /((['"]?[.#]?(\w+-?)+['"]?=?)+[0-9]*[</]?)/;
                 file = String(file); log(file);
        do {
          en = getElementsRE.exec(file);                   //Match elements line
          m = en[0];                                       //match
          log(m);
          newFile = m;                                    //Set matched line to newFile
          while (getStringRE.test(newFile)) {             //While there are string matches in newFile........
            n = getStringRE.exec(newFile);                //Match strings in newFile
            log(n[0]);
            o = n[0];                                     //match
            p.push(o);                                    //push string to Array
            newFile = newFile.replace(getStringRE, '------');  //replace matched string with --------.
          }
          log(p);
          code = _assembleCodeBlock(p);
             p = [];
          log(appendFlag, ['magentaBright', 'blink']);
          appendFlag = false;

          log(appendNode, ['magentaBright', 'blink']);
          file = file.replace(getElementsRE, code);    //Once all strings in a line are matched, replaced old line with new one, so that
        } while (getElementsRE.test(file));               //the line won't be matched again.
    log(file);
    return file;
  };



  var _assembleCodeBlock = function(list) {
    var sigs = [],
        sig,
        el,
        elist,
        elArray = [],
        index,
        len,
        file = String(file),
        codeBlock = [],
        codeString,
        cString;

    len = list.length;

    for (var j = 0; j < list.length; j++) {
      if (list[j].indexOf('<') !== -1 || list[j].indexOf('/') !== -1) {
        sig = list[j].substring(list[j].length - 1, list[j].length);
        sigs.push(sig);

        el = list[j].substring(0, list[j].length - 1);
            elArray.push(el);
      } else {
        sigs.push('0');
      }
    }
                                               // Get list length
    for (var i = 0; i < elArray.length; i++) {                                                              // Get append identifiers;
      log('element'); log(elArray[i]);
      index = elArray.indexOf(elArray[i]);                                  // Get index of current el
      if (elArray[i].indexOf('=') !== -1) {                              // Is there an '=' in the string?
        elist = elArray[i].split('=');     log('elist'); log(elist, ['brightGreen', 'blink'], true);              // If so, split string on '='.
        codeString = _.makeCode(elist, index);
        log(codeString, ['brightWhite', 'bold']);
        if (codeString !== null) {
          cString = _.appendCode(codeString, sigs[i], index, len, elArray);
        }
      } else {
        codeString = _.makeCode(elArray[i], index);

        if (codeString !== null) {
          cString = _.appendCode(codeString, sigs[i], index, len, elArray);
        }
      }

      log('here'); log(cString);
      log(Array.isArray(codeBlock));
      codeBlock.push(cString);

    }
    log(codeBlock);
    codeBlock = new RawSource(codeBlock.join(' '));
    code = codeBlock._value;
    log('Delilah'); log(codeBlock._value); log(codeBlock);
    return code;
  };



  var newDoc;

  // var inp = fs.createReadStream('./import.js');
  fs.readFile(source, function(err, doc) {
    if (!err) {
      // doc = _parseFileForImportFunction(doc);
      newDoc = _parseFileForElementsSyntax(doc);
      // codeBlock = _assembleCodeBlock(file, list);
      log(newDoc);
    } else {
      throw err;
    }
  });
};



module.exports = ElementsInterpreter;



ElementsInterpreter('./elements.js');


//DONE:0 check if id/class exists first, if not, then make it.
//DONE:10 pretty sure I need to specify that divs are being made when only id/class is given.

//TODO:0 More advanced parsing of elements syntax, for more complex application.
//NOTE: The above would necessitate altering the getStringRE, to include all opening and closing tags.
//      They would then need to be counted so that an algorithm could be formulated, revealing the correct appendNode
//      in every concievable situation.
//NOTE: Current limitations.
