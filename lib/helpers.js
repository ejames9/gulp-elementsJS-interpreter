'use_strict';

/*
helpers.js

Helper functions for the elements.js interpreter.

Author: Eric James Foster
License: MIT
*/

var log = require('elementsJS').log;
var RawSource = require('webpack-sources').RawSource;




global.appendFlag = false;
global.appendNode = '';

var tagNames = [
  'a', 'abbr', 'address', 'area', 'article', 'aside', 'article', 'b', 'base', 'bdi', 'bdo', 'blockquote', 'body', 'br', 'button',
  'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'dir', 'div', 'dl',
  'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header',
  'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'menu',
  'menuitem', 'meta', 'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'pre',  'progress', 'q',
  'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strike', 'strong', 'style',  'sub', 'summary',
  'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot',  'th', 'thead', 'time', 'title', 'tr', 'track', 'tt', 'u', 'ul', 'var', 'video', 'wbr'
];



var ternaryCode = function(code, list, els, index, len) {
  var el = [], elem, preCode, ternCode;

  if (Array.isArray(els)) {
    for (var i = 0; i < els.length; i++) {
      if (els[i].charAt(0) === "'") {
        el.push(els[i]);
      }
    }
  } else {
    el.push(els);
  }

  elem = isTag(el[0]) ? ('"' + el[0] + '"') : el[0];

  ternCode = '_$(' + elem + ') ? dom(' + elem + ') : ' + code;

  if (len === 1) {
    var varNum = varCount++;

    preCode = '(function() { var elem' + String(varNum) + ' = ';
    ternCode = preCode + ternCode;
    ternCode += '; \n\t return elem' + String(varNum) + '; })()';
  }
  return ternCode;
};


var __htmlTernaryCode = function(elId, trimmedCode, codeUnTrimmed) {
  var code1 = new RawSource(trimmedCode.join(''));
      code1 = code1._value;

  var code2 = new RawSource(codeUnTrimmed.join(''));
      code2 = code2._value;

  return '_$("' + elId + '") ? __(`' + code1 + '`, "' + elId + '") : __(`' + code2 + '`);';
};


var appendCode = function(code, sig, index, len, list) {
  var endCode = '',
      putNode = list[index - 1],
         self = this,
                divi;

      putNode = isTag(putNode)? ('"' + putNode + '"') : noop(putNode);

  (function() {
    if (sig.indexOf('<') !== -1) {
      if (!appendFlag) {
        if (index === 0) {
          if (Array.isArray(code)) {
            endCode = [];
            code.forEach(function(str) {
              str += '.put("body")\n';
              endCode.push(str);
            });
          } else {
            endCode = code + '.put("body");\n';
          }
        } else if (Array.isArray(code)) {
          endCode = [];
          code.forEach(function(str) {
            if (putNode.indexOf('=') !== -1) {
              divi = putNode.split('=');
              if (isNumeric(divi[1])) {
                putNode = divi[0];
              } else {
                putNode = divi[1];
              }
            }
            str += '.put(' + putNode + ')\n';
            endCode.push(str);
          });
        } else {
          if (putNode.indexOf('=') !== -1) {
            divi = putNode.split('=');
            if (isNumeric(divi[1])) {
              putNode = divi[0];
            } else {
              putNode = divi[1];
            }
          }
          endCode = code + '.put(' + putNode + ');\n';
        }
      } else {
        if (Array.isArray(code)) {
          endCode = [];
          code.forEach(function(str) {
            str += '.put(' + appendNode + ')\n';
            endCode.push(str);
          });
        } else {
          endCode = code + '.put(' + appendNode + ');\n';
        }
        appendFlag = false;
      }
    } else if (sig.indexOf('/') !== -1) {
      if (!appendFlag) {
        appendFlag = true;
        appendNode = list[index - 1] !== undefined ? list[index - 1] : "body";
        appendNode = isTag(appendNode) ? ('"' + appendNode + '"') : noop(appendNode);

        if (index !== 0) {
          if (Array.isArray(code)) {
            endCode = [];
            code.forEach(function(str) {
              if (appendNode.indexOf('=') !== -1) {
                var divi = appendNode.split('=');
                if (isNumeric(divi[1])) {
                  appendNode = divi[0];
                } else {
                  appendNode = divi[1];
                }
              }
              str += '.put(' + appendNode + ')\n';
              endCode.push(str);
            });
          } else {
            endCode = code + '.put(' + appendNode + ');\n';
          }
        } else {
          if (Array.isArray(code)) {
            endCode = [];
            code.forEach(function(str) {
              if (appendNode.indexOf('=') !== -1) {
                var divi = appendNode.split('=');
                if (isNumeric(divi[1])) {
                  appendNode = divi[0];
                } else {
                  appendNode = divi[1];
                }
              }
              str += '.put("body")\n';
              endCode.push(str);
            });
          } else {
            endCode = code + '.put("body");\n';
          }
        }
      } else {
        if (appendFlag) {
          if (Array.isArray(code)) {
            endCode = [];
            code.forEach(function(str) {
              if (appendNode.indexOf('=') !== -1) {
                var divi = appendNode.split('=');
                if (isNumeric(divi[1])) {
                  appendNode = divi[0];
                } else {
                  appendNode = divi[1];
                }
              }
              str += '.put(' + appendNode + ')\n';
              endCode.push(str);
            });
          } else {
            endCode = code + '.put(' + appendNode + ');\n';
          }
        }
      }
    }
  })();
  if (Array.isArray(endCode)) {
    endCode = String(endCode);
    endCode = 'element([\n' + endCode + '])\n';
  } else if (index === len - 1) {
    endCode = endCode.substring(0, endCode.length - 2);
  }
  return endCode;
};




var makeMultiCode = function(els) {

  var codeArray = [],
           bool = true,
      codeString;

  if (els.length === 2) {
    if (isTag(els[0])) {

      for (var i = 0; i < els[1]; i++) {
        if (bool) {
          bool = false;
          codeString = ' make(".' + els[0] + i + '", "' + els[0] + '")';
          codeArray.push(codeString);
        } else {
          codeString = 'make(".' + els[0] + i + '", "' + els[0] + '")';
          codeArray.push(codeString);
        }
      }
    } else if (isIdentifier(els[0])) {

        for (var j = 0; j < els[1]; j++) {
          if (bool) {
            bool = false;
            codeString = ' ' + makeCode(els[0]);
            codeArray.push(codeString);
          } else {
            codeString = makeCode(els[0]);
            codeArray.push(codeString);
          }
        }
    } else {
      log('Error!', ['red', 'bold']);
    }
  } else if (els.length === 3) {
    if (isId(els[1])) {

      for (var k = 0; k < els[2]; k++) {
        if (bool) {
          bool = false;
          codeString = ' make(' + els[1] + ', "' + els[0] + '")';
          codeArray.push(codeString);
        } else {
          codeString = 'make(' + els[1] + ', "' + els[0] + '")';
          codeArray.push(codeString);
        }
      }
    } else if (isClass(els[1])) {

      for (var l = 0; l < els[2]; l++) {
        if (bool) {
          bool = false;
          codeString = ' make(' + els[1] + ', "' + els[0] + '")';
          codeArray.push(codeString);
        } else {
          codeString = 'make(' + els[1] + ', "' + els[0] + '")';
          codeArray.push(codeString);
        }
      }
    }
  }
  return codeArray;
};




var makeCode = function(els, index) {
  var codeString,
      elem = Array.isArray(els) ? els[0] : els;
      elem = isTag(elem) ? ('"' + elem + '"') : noop(elem);


  if (Array.isArray(els)) {
    if (els.length === 2) {
      if (isTag(els[0])) {
        if(isId(els[1])) {
          codeString = 'make(' + els[1] +  ', "' + els[0] + '")';
        } else if (isClass(els[1])) {
          codeString = 'make(' + els[1] +  ', "' + els[0] + '")';
        } else if (isNumeric(els[1])) {
          codeString = makeMultiCode(els);
        } else {
          log('Something went awry.', ['red', 'bold']);
        }
      } else if (isId(els[0])) {
        if (isNumeric(els[1])) {
          codeString = makeMultiCode(els);
        } else {
          log('Invalid Enumerator.', ['red', 'bold']);
        }
      } else if (isClass(els[0])) {
        if (isNumeric(els[1])) {
          codeString = makeMultiCode(els);

        } else {
          log('Invalid Enumerator.', ['red', 'bold']);
        }
      } else {
        log('Error!', ['red', 'bold']);
      }
    } else if (els.length === 3) {
      codeString = makeMultiCode(els);
    } else {
      log('Invalid array length.', ['red', 'bold']);
    }
  } else {
    if (isSelector(els)) {
      if (isIdentifier((els))) {
        if (isId(els)) {
          codeString = 'make(' + els + ')';
        } else if (isClass(els)) {
          codeString = 'make(' + els + ')';
        } else {
          log('Invalid Format.', ['red', 'bold']);
        }
      } else {
        codeString = 'dom(' + els + ')';
      }
    } else if (isVariable(els)) {
      codeString = 'element(' + els + ')';
    } else if (isTag(els)) {
      codeString = 'make(".' + els +  '1", "' + els + '")';
    } else {
      log('Invalid Format.', ['red', 'bold']);
    }
  }

  if (!Array.isArray(codeString)) {
    if (index === 0 && codeString !== null) {
      codeString = ' '+ codeString;
    }
  }
  return codeString;
};


var buildElSyntaxCode = function(string) {

  var elSyntaxCode,
      elCodeBlock = [],
      code;

  elSyntaxCode = 'el(' + string + ')';
  elCodeBlock.push(elSyntaxCode);

  code = new RawSource(elCodeBlock.join(' '));
  code = code._value;
  return code;
};


var isIdentifier = function(l) {
  var identifierRE = /\'[#.](\w+[$_-]?)+\'/im;

  return identifierRE.test(l);
};

var isId = function(l) {
  if (l.indexOf('#') !== -1) {
    return true;
  } else {
    return false;
  }
};

var isClass = function(l) {
  if (l.indexOf('.') !== -1) {
    return true;
  } else {
    return false;
  }
};


var isTag = function(l) {
  var tick = 0;

  if (l) {
    if (typeof l === 'string') {
      for (var i = 0; i < tagNames.length;i++) {
        if (l === tagNames[i]) {
          tick++;
        }
      }
    } else {
      for (var i = 0; i < tagNames.length;i++) {
        if (l.toString('utf8') === tagNames[i]) {
          tick++;
        }
      }
    }
  }
  return (tick > 0) ? true : false;
};


var isVariable = function(el) {
  return (!isIdentifier(el) && !isTag(el) && !isSelector(el)) ? true : false;
};


var isSelector = function(l) {
  var cssSelectorRE = /\'([\s\[#.:*\w]+\s?[,>$+~|=^*-\w]+)+[\]\b]*\'/im;

  return cssSelectorRE.test(l);
};


var isNumeric = function(num) {
  return !isNaN(parseFloat(num)) && isFinite(num);
};



var nip = function(el) {
  if (el[1] === '.' || el[1] === '#') {
    l = el.slice(1);
  }
  return l;
};

var noop = function(el) {
   return el;
};




module.exports = {
              nip: nip,
             isId: isId,
     isIdentifier: isIdentifier,
        isNumeric: isNumeric,
    makeMultiCode: makeMultiCode,
__htmlTernaryCode: __htmlTernaryCode,
buildElSyntaxCode: buildElSyntaxCode,
      ternaryCode: ternaryCode,
       appendCode: appendCode,
         makeCode: makeCode,
          isClass: isClass,
            isTag: isTag
                 };







// var element = queryDOM(el) !== undefined ? 'dom'
