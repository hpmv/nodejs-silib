var readers = require("./readers.js");

var CharReader = function() {

  this.feed = function(str) {
    for(var i=0;i<str.length;i++){
      if(!readers.is_whitespace(str[i])){
        return {
          value: str[i],
          rest: str.substring(i+1)
        };
      }
    }
    return true;
  };

  this.eof = function() {
    throw "Unexpected EOF while reading char";
  };

  this.init = function(context) {
  };
};

module.exports = exports = CharReader;
