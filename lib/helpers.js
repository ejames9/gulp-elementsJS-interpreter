'use_strict';

/*
helpers.js

Helper functions for the elements.js interpreter.

Author: Eric James Foster
License: MIT
*/

var log = require('elements.js').log;
var dom = require('elements.js').dom;



global.appendFlag = false;
global.appendNode = '';
global.varCount   = 0;



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

  ternCode = '$(' + elem + ') ? dom(' + elem + ') : ' + code;

  if (len === 1) {
    var varNum = varCount++;

    preCode = 'var elem' + String(varNum) + ' = ';
    ternCode = preCode + ternCode;
    ternCode += '; \n\t elem' + String(varNum);
  }
  return ternCode;
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
          log('here too  -- ' + putNode, ['magenta', 'bold']);
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
    endCode = '[\n' + endCode + ']\n';
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

      log(elem, ['green', 'bold']);


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
    if (isTag(els)) {
      log('been here', ['red', 'bold']);
      codeString = 'make(".' + els +  '1", "' + els + '")';
    } else if (isId(els)) {
      codeString = 'make(' + els + ')';
    } else if (isClass(els)) {
      codeString = 'make(' + els + ')';
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


var isIdentifier = function(l) {
  if (l.indexOf('#') !== -1 || l.indexOf('.') !== -1) {
    return true;
  } else {
    return false;
  }
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
  if (typeof l === 'string') {
    if (l.indexOf('#') !== -1 || l.indexOf('.') !== -1) {
      return false;
    } else {
      return true;
    }
  } else {
    return true;
  }
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
      ternaryCode: ternaryCode,
       appendCode: appendCode,
         makeCode: makeCode,
          isClass: isClass,
            isTag: isTag
                 };







// var element = queryDOM(el) !== undefined ? 'dom'
