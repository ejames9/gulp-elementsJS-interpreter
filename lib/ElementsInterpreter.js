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
    var v, kees, kee;

     codeBlock = ['///Begin Module requires///\n \n'];
    codeString = '';

    for (var key in obj) {
      if (key.indexOf('.') !== -1) {
        kees = key.split('.');          log(kees, ['cyanBright', 'bold']);
         kee = kees[0];
      }
      v = kee || key;

      if (obj[key] !== null && Array.isArray(obj[key])) {
        codeString = 'var ' + v + ' = require("' + key + '");\n';
        codeBlock.push(codeString);

        for (var i = 0; i < obj[key].length; i++) {
          codeString = 'var ' + obj[key][i] + ' = ' + v + '.' + obj[key][i] + '; \n';
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
        codeString = 'var ' + v + ' = require("' + key + '");\n';
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

    var getFuncRE = /imports\(\{\s*.*\n?([^})]*\n?)*\}\)\;/im,
         getObjRE = /\{\s*.*\n?([^})]*\n?)*\}/im;

    var newFile = doc.toString();
       log(getFuncRE.test(newFile));
       if (getFuncRE.test(newFile)) {
         while (getFuncRE.test(newFile)) {
           var l = getFuncRE.exec(newFile),
               m = l[0],
               n = getObjRE.exec(m);

          this.o = n[0];
           var formOfEvil = new Function('this.p = ' + this.o + ';');
           formOfEvil();      //Used function constructor to convert extracted object into object code.

           var newCode = _convertModulesObjectToCodeBlock(this.p);
               newCode = newCode._value;
               newFile = newFile.replace(getFuncRE, newCode);

         }
       } else {
         log('No matches found.', ['red', 'bold']);
       }
    return newFile;
  };




  var _parseFileForElementsSyntax = function(file) {
    var newFile, code;
    var m, n, en, o, p  = [];

    var getElementsRE = /(<(['"]?[.#]?(\w+.?)+<?['"]?=?)+(\s?\/>)+)+/,
          getStringRE = /((['"]?[.#]?(\w+-?)+['"]?=?)+[0-9]*[</]?)/;
                //  file = file.toString('utf8');
        do {
          en = getElementsRE.exec(file);                   //Match elements line
          m = en[0];                                       //match
          newFile = m;                                    //Set matched line to newFile
          while (getStringRE.test(newFile)) {             //While there are string matches in newFile........
            n = getStringRE.exec(newFile);                //Match strings in newFile
            o = n[0];                                     //match
            p.push(o);                                    //push string to Array
            newFile = newFile.replace(getStringRE, '------');  //replace matched string with --------.
          }
          code = _assembleCodeBlock(p);
             p = [];
          appendFlag = false;

          file = file.replace(getElementsRE, code);    //Once all strings in a line are matched, replaced old line with new one, so that
        } while (getElementsRE.test(file));               //the line won't be matched again.

    return file;
  };



  var _assembleCodeBlock = function(list) {
    var sig,
        el,
        elist,
        index,
        len,
        file = String(file),
        codeBlock = [],
        elArray = [],
        sigs = [],
        codeString,
        cString;

    len = list.length;

    for (var j = 0; j < len; j++) {
      if (list[j].indexOf('<') !== -1 || list[j].indexOf('/') !== -1) {
        sig = list[j].substring(list[j].length - 1, list[j].length);
        sigs.push(sig);

        el = list[j].substring(0, list[j].length - 1);
            elArray.push(el);
      } else {
        sigs.push('0');
      }
    }

    for (var i = 0; i < elArray.length; i++) {
      index = elArray.indexOf(elArray[i]);                               // Get index of current el
      if (elArray[i].indexOf('=') !== -1) {                              // Is there an '=' in the string?
        elist = elArray[i].split('=');                                   // If so, split string on '='.
        codeString = _.makeCode(elist, index);

        if (codeString !== null) {
          cString = _.appendCode(codeString, sigs[i], index, len, elArray);
        }
      } else {
        codeString = _.makeCode(elArray[i], index);

        if (codeString !== null) {
          cString = _.appendCode(codeString, sigs[i], index, len, elArray);
        }
      }
      codeBlock.push(cString);
    }
    codeBlock = new RawSource(codeBlock.join(' '));
    code = codeBlock._value;

    return code;
  };


  var newDoc;

    file = _parseFileForImportFunction(file);
  newDoc = _parseFileForElementsSyntax(file);


  return newDoc;
};



module.exports = ElementsInterpreter;



// ElementsInterpreter('./elements.js');


//DONE:0 check if id/class exists first, if not, then make it.
//DONE:10 pretty sure I need to specify that divs are being made when only id/class is given.

//TODO:0 More advanced parsing of elements syntax, for more complex application.
//NOTE: The above would necessitate altering the getStringRE, to include all opening and closing tags.
//      They would then need to be counted so that an algorithm could be formulated, revealing the correct appendNode
//      in every concievable situation.
//NOTE: Current limitations.
