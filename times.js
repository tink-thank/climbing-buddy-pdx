var colors = require('colors');
var start = new Date();

function timeStamp () {
  var hours = new Date(Date.now()).getHours();
  var minutes = new Date(Date.now()).getMinutes();
  var seconds = new Date(Date.now()).getSeconds();
  
  function zeroInsert (arg) {
    if (arg < 10) {
      return '0' + arg.toString();
    } else {
      return arg.toString();
    }
  }
  
  return( zeroInsert(hours)+ ':' +zeroInsert(minutes)+ ':' +zeroInsert(seconds) );
}

function timeOut(timeIn) {
  var current = Date.now();
  var difference = (current - timeIn) / 1000;
  var minutes = (difference / 60).toFixed();
  var message = 'Working for ' + minutes + ' minutes';
  
  if (difference > 1500) {
    return message.magenta + ', maybe you should:\n' + 'TAKE A BREAK'.rainbow;
  } else {
    return message.magenta;
  }
  
  
}

module.exports.timeStamp = timeStamp;
module.exports.timeOut = timeOut;