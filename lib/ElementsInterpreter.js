//var firstAttemptRE = /^import\(\{\s*([\'\"][\w\W]+[\'\"]\s?\:\s*\[\s*([\'\"][\w\W]+[\'\"])?([\'\"]\w+[\'\"]\s*\,?\s*)*[\'\"]\w+[\'\"]\s*\]\s*\,?\s*)+\}\)\;/g;
'use_strict';
/*
ElementsInterpreter.js
v0.1.0

This is the main file of the elements.js interpreter. The interpreter parses JS
files for 'illegal' elements.js syntactical sugar, and replaces it with 'legal' elements.js
alias functions.

Author: Eric James Foster
License: MIT
*/




//es6 imports
var _          = require('./helpers');
var log        = require('elementsJS').log;
var info       = require('elementsJS').info;
var warn       = require('elementsJS').warn;
var err        = require('elementsJS').err;
var lookBehind = require('elementsJS').lookBehind;
var trim       = require('lodash').trim;
var join       = require('lodash').join;

//node modules
var fs         = require('fs');
var spawn      = require('child_process').spawnSync;
var RawSource  = require('webpack-sources').RawSource;


var preCodeString = '\n\n\n ///-------elementsJS requires---------///\n' +
                    'var _$ = require("elementsJS")._$; \n' +
                    'var dom = require("elementsJS").dom; \n' +
                    'var make = require("elementsJS").make; \n' +
                    'var element = require("elementsJS").element; \n' +
                    '///|------------------------------------|// \n\n\n';


//The elementsJS elements Syntax Interpreter.
var ElementsInterpreter = function(file) {
  var list,
      codeBlock = [],
      codeString,
      appendPoint,
      source = file;

      global.varCount = 0;

  //This function creates code from the text extracted by a reg exp.
  var _convertModulesObjectToCodeBlock = function(obj) {
    var v, kees, kee,
                 getBlobRE = /(\.+\/)+(\w+\/?)+(\.js)?/im;
         var getVariableRE = /\/\w+\./im;

    //Begin code block as below, as these functions are needed to make the interpereter work.
    codeBlock = ['\n\n\n///-------Begin Module Imports---------///\n' +
                 'var _$ = require("elementsJS")._$; \n' +
                 'var dom = require("elementsJS").dom; \n' +
                 'var make = require("elementsJS").make; \n' +
                 'var element = require("elementsJS").element; \n' +
                 '///|------------------------------------|//\n\n\n'];

    codeString = '';

    //Iterate over object keys and values to create code block.
    for (var key in obj) {
      //Check key against file blob reg exp.
      if (getBlobRE.test(key)) {
        if (Array.isArray(obj[key])) {
          v = getBlobRE.exec(key);
          v = getVariableRE.exec(v);
          v = '_' + String(v).substring(1, String(v).length -1);

          codeString = 'var ' + v + ' = require("' + key + '");\n';
          codeBlock.push(codeString);

          for (var i = 0; i < obj[key].length; i++) {
            codeString = 'var ' + obj[key][i] + ' = ' + v + '.' + obj[key][i] + '; \n';
            codeBlock.push(codeString);
            if (i === obj[key].length - 1) {
              codeBlock.push('    \n');
            }
          }
        } else if (obj[key] === null) {
          codeString = 'require("' + key + '");\n';
          codeBlock.push(codeString);
          codeBlock.push('     \n');
        } else {
          v = obj[key];

          codeString = 'var ' + v + ' = require("' + key + '");\n';
          codeBlock.push(codeString);
          codeBlock.push('     \n');
        }
      } else {
        //remove period from '.js' if it's there, to create variable name.
        if (key.indexOf('.') !== -1) {
          kees = key.split('.');
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
    }
    codeBlock.push('///End Module requires///\n \n');

    return new RawSource(codeBlock.join(''));
  };


  var _parseFileForImportSyntax = function(doc) {
    this.o = null;
    this.p = null;
    this.object = {},
    dependencies = [],
    useSyntaxPlaceholder = '||*------<(USE-SYNTAXPLACEHOLDER)>------*||';

    var getFuncRE = /imports\(\{\s*.*\n?([^})]*\n?)*\}\)\;/im,
     getUseLineRE = /use\ ?(["'][^'"]+['"])\ ?(as )?\{? ?((([\$\w]+\,?)\ ?)*)\}?\ ?/im,
   getUseSyntaxRE = /(use\ ?(["'][^'"]+['"])\ ?(as )?\{? ?((([\$\w]+\,?)\ ?)*)\}?\s)+/im,
  useStaxHolderRE = /(?:\|\|\*\-+<\(USE\-SYNTAXPLACEHOLDER\)>\-+\*\|\|\s?)+/im,
        getBlobRE = /(\.+\/)+(\w+\/?)+(\.js)?/im,
         getObjRE = /\{\s*.*\n?([^})]*\n?)*\}/im,
            funcs;


    var newFile = doc.toString();
       if (getUseSyntaxRE.test(newFile)) {
         while (getUseSyntaxRE.test(newFile)) {
           var s = getUseSyntaxRE.exec(newFile)[0];
           if (getUseLineRE.test(s)) {
             while (getUseLineRE.test(s)) {
               var l = getUseLineRE.exec(s);
               //if library is not a blob, list the dependency.
               if (l[1]) {
                 if (!getBlobRE.test(l[1])) {
                   dependencies.push(trim(l[1], "'"));
                 }
               }
               //Build the Imports Object..
               if (l[2]) {
                 this.object[trim(l[1], "'")] = l[3];
               } else if (l[3]) {
                 funcs = [];
                 if (l[3].indexOf(',') === -1) {
                   funcs.push(l[3]);
                   this.object[trim(l[1], "'")] = funcs;
                 } else {
                   funcs = l[3].split(', ');
                   this.object[trim(l[1], "'")] = funcs;
                 }
               } else {
                 this.object[trim(l[1], "'")] = null;
               }
               //Replace 'use' syntax line with placeholder...
               s = s.replace(getUseLineRE, useSyntaxPlaceholder);
             }
             //Replace  'use' syntax block with placeholder block...
             newFile = newFile.replace(getUseSyntaxRE, s);
           }
           //Convert Import Object to new code block, and replace placeholder block.
           var newCode = _convertModulesObjectToCodeBlock(this.object);
               newCode = newCode._value;
               newFile = newFile.replace(useStaxHolderRE, newCode);
         }
       } else {
         info('No matches found.');
         newFile = preCodeString + newFile;
       }
    return {
            file: newFile,
    dependencies: dependencies
                              };
  };


  //This function parses the given file for inline HTML, removes and reinserts it into the elementJS __() function.
  var _parseFileForInlineHTML = function(file) {
    var htmlMatch,
        separateTags,
        elIdentifier,
        codeArrTrimmed,
        codeArrUnTrimmed,
        codeString,
        codeStringArray = [],
        inlineHTMLPlaceholder = '||*------<(INLINEHTMLPLACEHOLDER)>------*||';

    //Reg Exp's.
    var collectHTMLRE = /(?:(?:<\w+(?:\s?\w+\=["'][#\w\-\/\.]+['"])*>\s*)+[\w\s!"#$%&'()*+,./:;=?@\^_`{|}~-]*(?:<\/\w+>\s*)*)+(<\/\w+)?>/im,
     extractOuterElRE = /<\w*(\s?\w+\=["'][#\w\-\.\/]*['"])?>/im,
    htmlPlaceholderRE = /\|\|\*-*<\(INLINEHTMLPLACEHOLDER[0-9]*\)>-*\*\|\|/im,
       separateTagsRE = /<\/?\w+(?:\s?\w+\=["'][#\w\-\.\/]*['"])*>(?:[\w\s!"#$%&'()*+,./:;=?@\^_`{|}~-]*[\w!"#$%&'()*+,./:;=?@\^_`{|}~-])?/gim,
              classRE = /class/im,
                tagRE = /[\w\-]+/im,
                 IdRE = /id/im,
             stringRE = /["'][\w\-\$]*['"]/im;

    //Find and replace inline HTML.
    if (collectHTMLRE.test(file)) {
      while (collectHTMLRE.test(file)) {
        //get HTML.
        htmlMatch = collectHTMLRE.exec(file)[0];
        //Separate into individual tags.
        separateTags = htmlMatch.match(separateTagsRE);

        if (IdRE.test(separateTags[0])) {
          elIdentifier = '#' + tagRE.exec(stringRE.exec(separateTags[0])[0])[0];
          //Create copy of untrimmed html array.
          codeArrUnTrimmed = [];
          for (var i = 0; i < separateTags.length;i++) {
            codeArrUnTrimmed.push(separateTags[i]);
          };
          //Remove outer el.
          separateTags.pop()
          separateTags.shift()
          //HTML with outer element removed.
          codeArrTrimmed = separateTags;
          //Create code to reinsert into file.
          codeString = _.__htmlTernaryCode(elIdentifier, codeArrTrimmed, codeArrUnTrimmed);
          //Push codeString to array.
          codeStringArray.push(codeString);
          //replace inline HTML with placeholder.
          file = String(file).replace(collectHTMLRE, inlineHTMLPlaceholder);

        } else if (classRE.test(separateTags[0])) {
          elIdentifier = '.' + tagRE.exec(stringRE.exec(separateTags[0])[0])[0];
          //Create copy of untrimmed html array.
          codeArrUnTrimmed = [];
          for (var i = 0; i < separateTags.length;i++) {
            codeArrUnTrimmed.push(separateTags[i]);
          };
          //Remove outer el.
          separateTags.pop()
          separateTags.shift()
          //HTML, outer element removed.
          codeArrTrimmed = separateTags;
          //Create code.
          codeString = _.__htmlTernaryCode(elIdentifier, codeArrTrimmed, codeArrUnTrimmed);
          //Push codeString to array.
          codeStringArray.push(codeString);
          //replace inline HTML with placeholder.
          file = file.replace(collectHTMLRE, inlineHTMLPlaceholder);

        } else if (tagRE.test(separateTags[0])) {
          elIdentifier = tagRE.exec(separateTags[0])[0];
          warn('This may not be a good idea.....');
        } else {
          err('Invalid HTML.');
        }
      }
    } else {
      info('No Inline HTML.');
    }
    //Replace Inline HTML Placeholders with new code.
    while (htmlPlaceholderRE.test(file)) {
      file = file.replace(htmlPlaceholderRE, codeStringArray.shift());
    }
    return file;
  };


  //This function parses the given file for all elementsJS syntax and uses helper functions in helper.js to replace it with legal JS.
  var _parseFileForElementsSyntax = function(file) {
    var newFile,
           tick = 0,
           match,
           elMatch,
           elString,
           badMatchArray = [],
           code = '';

    var m, n, en, o, p  = [];

    var getMLElCommentsRE = /\/\*[^*]*(?:<(?:['"]?[\.#]?(?:\w+[^\s].?[0-9]?)+<?['"]?=?)+(?:\s?\/>)+)+[^*]*\*\//im,
        getElemCommentsRE = /(?:\/\/.*)(?:(?:<(?:['"]?[\.#]?(?:\w+[^\s].?[0-9]?)+<?['"]?=?)+(?:\s?\/>)+)+).*\B/im,
            getElementsRE = /<[^/\n]*\/>(\/>)*/im,
              getStringRE = /((['"]?[\[#.:*]?(\w+-?)+[>$+^*,~|\-\]\s]*['"]?=?)+[0-9]*[</]?)/im,
    badMatchPlaceholderRE = /\|\|\*-*<\(BADMATCHPLACEHOLDER[0-9]*\)>-*\*\|\|/im,
      mlCommPlaceholderRE = /\|\|\*-*<\(MULTILINEPLACEHOLDER[0-9]*\)>-*\*\|\|/im,
      __FuncPlaceholderRE = /\|\|\*-*<\(__FUNCTIONPLACEHOLDER[0-9]*\)>-*\*\|\|/im,
        commPlaceholderRE = /\|\|\*-*<\(PLACEHOLDER[0-9]*\)>-*\*\|\|/im,
              get__FuncRE = /__\(`[^;]*;/im;
            leftContextRE = /(.*\n*)+[ \(\=]+$/i,
         elSyntaxStringRE = /["'][#.]?[\w-_]+['"]/i,
               elSyntaxRE = /<["'][#.]?[\w-_]+['"]>/i;

        //The following code will replace all "__()" functions, with a placeholder.
        if (get__FuncRE.test(file)) {
          var __Func,
              __FuncPlaceholder = '||*------<(__FUNCTIONPLACEHOLDER)>------*||',
              __FunctionArray    = [];

          //replace all comments with eJS syntax, with placeholder.
          while (get__FuncRE.test(file)) {
            __Func = get__FuncRE.exec(file)[0];

            __FunctionArray.push(__Func);
            file = file.replace(get__FuncRE, __FuncPlaceholder);
          }
        }
        //The following code will replace all "/**/" style mult-line comments that contain eJS syntax, with a placeholder.
        if (getMLElCommentsRE.test(file)) {
          var mlComment,
              mlCommentPlaceholder = '||*------<(MULTILINEPLACEHOLDER)>------*||',
              mlElCommentsArray    = [];

          //replace all comments with eJS syntax, with placeholder.
          while (getMLElCommentsRE.test(file)) {
            mlComment = getMLElCommentsRE.exec(file)[0];

            mlElCommentsArray.push(mlComment);
            file = file.replace(getMLElCommentsRE, mlCommentPlaceholder);
          }
        }
        /*This bit of code replaces all "//" style comments that contain elementsJS syntax with a placeholder, that will be
        replaced with the original comment once the interpreter is done searching for eJS syntax. This will solve the
        problem of the interpreter confusing comments with actual code that needs attention.*/
        if (getElemCommentsRE.test(file)) {
          var comment,
              commPlaceholder = '||*------<(PLACEHOLDER)>------*||',
              elemCommentsArray = [];
          //replace all comments with eJS syntax, with placeholder.
          while (getElemCommentsRE.test(file)) {
            comment = getElemCommentsRE.exec(file)[0];

            elemCommentsArray.push(comment);
            file = file.replace(getElemCommentsRE, commPlaceholder);
          }
        }
        //||<===============el Syntax=========================>>
        //Find el Syntax and replace with Vanilla javascript.
        while (elSyntaxRE.test(file)) {
          elMatch  = elSyntaxRE.exec(file);
          elMatch  = elMatch[0];
          elString = elSyntaxStringRE.exec(elMatch)[0];

            elCode = _.buildElSyntaxCode(elString);

          file = file.replace(elSyntaxRE, elCode);
        }
        //||<===============elementsJS elements Syntax=========================>>
        //replace eJS syntax with legal javascript.
        while (getElementsRE.test(file)) {
          //this variable will count # of matches.
          tick++;
          //Using lookBehind() function to match a string that follows a specific pattern. A 2nd shot at weeding out bad matches.
          match = lookBehind(leftContextRE, getElementsRE, file);
          if (match) {
            //Set matched line to newFile
            newFile = match;
            //While there are string matches in newFile........
            while (getStringRE.test(newFile)) {
              //Match strings in newFile
              n = getStringRE.exec(newFile);
              //match
              o = n[0];
              //push string to Array
              p.push(o);
              //replace matched string with --------.
              newFile = newFile.replace(getStringRE, '------');
            }
            code += _assembleCodeBlock(p);
               p = [];
            appendFlag = false;

            /*Once all strings in a line are matched, replaced old line with new one, so that
            the line won't be matched again.*/
            file = file.replace(getElementsRE, code);
            code = '';
          } else {
            var badMatchPlaceholder = '||*------<(BADMATCHPLACEHOLDER)>------*||';
            //Match bad line
            match = getElementsRE.exec(file);
            badMatchArray.push(match);

            file.replace(getElemCommentsRE, badMatchPlaceholder);
          }
        };
        //Replace badMatchPlaceholders with original code.
        while (badMatchPlaceholderRE.test(file)) {
          file = file.replace(badMatchPlaceholderRE, badMatchArray.shift());
        }
        //Replace __() Function placeholders with original code.
        while (__FuncPlaceholderRE.test(file)) {
          file = file.replace(__FuncPlaceholderRE, __FunctionArray.shift());
        }
        //Replace placeholders with original comments.
        while (commPlaceholderRE.test(file)) {
          file = file.replace(commPlaceholderRE, elemCommentsArray.shift());
        }
        //Replace multi-line placeholders with original comments.
        while (mlCommPlaceholderRE.test(file)) {
          file = file.replace(mlCommPlaceholderRE, mlElCommentsArray.shift());
        }
        if (tick === 0)
          info('No Matches.');

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
        cString,
        cssSelectorRE = /\'([\s\[#.:*\w]+\s?[,>$+~|=^*-\w]+)+[\]\b]*\'/im,
        tagMakerRE = /\w+\=['"][#.][\w-_]+["']/im;

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
      // Get index of current el
      index = elArray.indexOf(elArray[i]);
      // Is there an '=' in the string and it's not a css selector?
      if (elArray[i].indexOf('=') !== -1) {
        //If string isn't matched by the css selector RE....
        if (!cssSelectorRE.test(elArray[i])) {
          // split string on '='.
          elist = elArray[i].split('=');
          //Create initial codeString.
          codeString = _.makeCode(elist, index);

          if (codeString !== null) {
            if (codeString.indexOf('element') === -1 && !cssSelectorRE.test(codeString)) {
              cString = _.appendCode(codeString, sigs[i], index, len, elArray);
            }
          }
        //If string is  matched by cssSelectorRE, but is also matched by the tagMakerRE....
        } else if (tagMakerRE.test(elArray[i])) {
          // split string on '='.
          elist = elArray[i].split('=');
          codeString = _.makeCode(elist, index);

          if (codeString !== null) {
            if (codeString.indexOf('element') === -1) {
              cString = _.appendCode(codeString, sigs[i], index, len, elArray);
            }
          }
        //string is matched by the cssSelectorRE, but not the tagMakerRE...
        } else {
          codeString = _.makeCode(elArray[i], index);

          if (codeString !== null && codeString !== undefined) {
            if (codeString.indexOf('element') === -1 && codeString.indexOf('make') !== -1) {
              cString = _.appendCode(codeString, sigs[i], index, len, elArray);
            }
          }
        }
      //string contains no '=', send to _.makeCode() function to create initial codeString.
      } else {
        codeString = _.makeCode(elArray[i], index);

        if (codeString !== null && codeString !== undefined) {
          if (codeString.indexOf('element') === -1 && codeString.indexOf('make') !== -1) {
            cString = _.appendCode(codeString, sigs[i], index, len, elArray);
          }
        }
      }
      if (cString) {
        codeString = cString;
      }
      //If first element in a line, need to add conditional code.
      if (index === 0) {
        if (codeString.indexOf('element') === -1 && codeString.indexOf('make') !== -1) {
          if (elist) {
            codeString = _.ternaryCode(cString, elArray, elist, index, len)
          } else {
            codeString = _.ternaryCode(cString, elArray, elArray[i], index, len)
          }
        }
      }
      codeBlock.push(codeString);
    }
    codeBlock = new RawSource(codeBlock.join(' '));
    code = codeBlock._value;

    return code;
  };


  var _installNPMPackages = function(dependencies) {
    var args = ['install', '--save'];

    dependencies.forEach((package)=> {
      try {
        fs.accessSync(process.cwd() + '/node_modules/' + package, fs.F_OK);
      } catch(e) {
        args.push(package);
      }
    });
    if (args.length > 2) {
      log('Installing ' + String(args.length - 2) + ' npm Packages.....', ['red', 'bold']);
      var child = spawn('npm', args, {
        cwd: process.cwd(),
        stdio: 'pipe'
      });
      if (child.stdout.length > 0) {
        log(child.stdout, 'green');
        info('Packages Installed.');
      }
      if (child.stderr.length > 0) {
        log(child.stderr, 'red');
        err('Whoops! Guess not....');
      }
    } else {
      info('No packages to install.');
    }
  };


  var newDoc, packages;

    file     = _parseFileForImportSyntax(file);
    packages = file.dependencies;
    file     = _parseFileForInlineHTML(file.file);
    newDoc   = _parseFileForElementsSyntax(file);
               _installNPMPackages(packages);

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
// \/\/Change( [<>]*)*
