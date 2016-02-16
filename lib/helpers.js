// Helper functions for the elements.js interpreter.


var log = require('elements.js').log;
var dom = require('elements.js').dom;



global.appendFlag = false;
global.appendNode = '';


var appendCode = function(code, sig, index, len, list) {
  var endCode = '';

  // log(code, ['lightBlue', 'bold']); log(list); log(index); log(len);
  var putNode = list[index - 1],
      self = this,
      divi;

      log(sig, ['brightWhite', 'bold']);
      log(code, ['brightWhite', 'bold']);


  (function() {
    if (sig.indexOf('<') !== -1) {
      if (!appendFlag) {
        if (index === 0) {
          if (Array.isArray(code)) {
            endCode = [];
            code.forEach(function(str) {
              str += '.put(document.body)\n';
              endCode.push(str);
            });
          } else {
            endCode = code + '.put(document.body);\n';
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
      log(appendFlag, ['brightGreen', 'bold']);
      log('appendFlag', ['brightGreen', 'bold']);
      if (!appendFlag) {
        appendFlag = true;
        appendNode = list[index - 1] !== undefined ? list[index - 1] : 'document.body';           log(appendNode, ['brightWhite', 'bold']);

        if (index !== 0) {
          if (Array.isArray(code)) {
            log(code, ['brightWhite', 'bold']);
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
              str += '.put("document.body")\n';
              endCode.push(str);
            });
          } else {
            endCode = code + '.put("document.body");\n';
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
  log(endCode, ['yellow', 'bold']);

  if (Array.isArray(endCode)) {
    log(self, ['yellow', 'bold']); log(endCode, ['yellow', 'bold']);

    endCode = String(endCode);
    endCode = '[\n' + endCode + ']\n';
  } else if (index === len - 1) {
    log(endCode, ['magenta', 'bold']);
    endCode = endCode.substring(0, endCode.length - 2);
    log(endCode, ['magenta', 'bold']);

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
        log(i, ['brightBlue', 'bold']);
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

  log(els, ['magenta', 'blink']);

  var codeString,
      elem = Array.isArray(els) ? els[0] : els;
      elem = dom(elem);

      log(elem, ['red', 'bold']); log('shit', ['red', 'bold']);


  if (elem === 0) {                              //If item is first in the list of elems, and not pre-existing in the DOM.
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
            log(codeString, ['white', 'blink']);
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
        codeString = 'make(".' + els +  '1", "' + els + '")';
      } else if (isId(els)) {
        codeString = 'make(' + els + ')';
      } else if (isClass(els)) {
        codeString = 'make(' + els + ')';
      } else {
        log('Invalid Format.', ['red', 'bold']); log(els, ['red', 'bold']);
      }
    }
  } else {
    codeString = null;
  }
  if (index === 0 && codeString !== null) {
    codeString = ' '+ codeString;
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
  if (l.indexOf('#') !== -1 || l.indexOf('.') !== -1) {
    return false;
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




module.exports = {
              nip: nip,
             isId: isId,
     isIdentifier: isIdentifier,
        isNumeric: isNumeric,
    makeMultiCode: makeMultiCode,
       appendCode: appendCode,
         makeCode: makeCode,
          isClass: isClass,
            isTag: isTag
                 };
