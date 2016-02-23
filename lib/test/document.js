/*
This module exists to simulate the document object in the browser
so that I can build/test the interpreter in a node.js environment, without
getting errors every time it is referenced.
*/



var getElementById = function(el) {
  var num = Math.floor(Math.random() * 10 + 1);

  return 0;
};

var getElementsByClassName = function(el) {
  var un = [0, 0];
  var num = Math.floor(Math.random() * 10 + 1);

  return un;
};

var getElementsByTagName = function(el) {
  var els = ['main', 'body', 'html'];
  var sig = false;

  if (els.indexOf(el) !== -1) {
    sig = true;
  }
  var un = [0, 0];
  var num = Math.floor(Math.random() * 10 + 1);

  if (sig) {
    var ells = [];
        ells.push(el);
        ells.push(el);
        return ells;
  } else {
    return un;
  }
};


  module.exports = {
          getElementById: getElementById,
    getElementsByTagName: getElementsByTagName,
  getElementsByClassName: getElementsByClassName
                   };
