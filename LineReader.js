var readers = require("./readers.js");

var LineReader = function() {
  var buffer = "";

  function trim_ending(str) {
    while(str[str.length-1] =='\n' || str[str.length-1] =='\r'){
      str = str.substring(0, str.length-1);
    }
    return str;
  }

  function feedchar(c) {
    if(buffer[buffer.length-1] == '\n' || buffer[buffer.length-1] =='\r' && c!='\n') {
      return trim_ending(buffer);
    }
    buffer += c;
    return true;
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
      throw "Unexpected EOF while reading line";
    }
    return trim_ending(buffer);
  };

  this.init = function(context) {
    buffer = '';
  };
};

module.exports = exports = LineReader;
