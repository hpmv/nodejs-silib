var readers = require("./readers.js");

var IntReader = function() {
  var buffer = "";

  function feedchar(c) {
    if(c >= '0' && c <= '9') {
      buffer += c;
      return true;
    } else {
      if (buffer == "") {
        if(c=='-') {
          buffer += c;
          return true;
        }
        return readers.is_whitespace(c);
      }
      return parseInt(buffer);
    }
  }

  this.feed = function(str) {
    for(var i=0;i<str.length;i++){
      var res = feedchar(str[i]);
      if(res === false) {
        throw "Expected integer but see: "+str[i];
      } else if(res === true) {

      } else {
        return {
          value: res,
          rest: str.substring(i)
        };
      }
    }
    return true;
  };

  this.eof = function() {
    if(buffer == '') {
      throw "Unexpected EOF while reading integer";
    }
    return parseInt(buffer);
  };

  this.init = function(context) {
    buffer = '';
  };
};

module.exports = exports = IntReader;
