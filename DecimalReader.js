var readers = require("./readers.js");

var DecimalReader = function() {
  var buffer = "";

  function feedchar(c) { //TODO: implement more standard float format
    if(c >= '0' && c <= '9' || c=='.') {
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
      return parseFloat(buffer);
    }
  }

  this.feed = function(str) {
    for(var i=0;i<str.length;i++){
      var res = feedchar(str[i]);
      if(res === false) {
        throw "Expected decimal number but see: "+str[i];
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
      throw "Unexpected EOF while reading decimal number";
    }
    return parseFloat(buffer);
  };

  this.init = function(context) {
    buffer = '';
  };
};

module.exports = exports = DecimalReader;
