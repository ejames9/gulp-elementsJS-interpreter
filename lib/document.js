



console.log();


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
