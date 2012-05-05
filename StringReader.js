var readers = require("./readers.js");

var StringReader = function() {
  var buffer = "";

  function feedchar(c) { //TODO: don't really need char-by-char reads for string. Optimize.
    if(!readers.is_whitespace(c)) {
      buffer += c;
      return true;
    } else {
      if(buffer == '') {
        return true;
      }
      return buffer;
    }
  }

  this.feed = function(str) {
    for(var i=0;i<str.length;i++){
      var res = feedchar(str[i]);
      if(res === false) {

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
      throw "Unexpected EOF while reading string";
    }
    return buffer;
  };

  this.init = function(context) {
    buffer = '';
  };
};

module.exports = exports = StringReader;
