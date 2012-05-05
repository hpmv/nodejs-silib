var Context = require('./Context.js');

var ArrayReader = function(elementReader, length) {
  var remains = 0;
  var result = [];
  var reader = elementReader;
  var lenfunc = Context.compile(length);
  var _context;
  this.init = function(context) {
    remains = context.evaluate(lenfunc);
    result = [];
    reader.init(context);
    _context = context;
  };

  this.feed = function(str) {
    while (str != "") {
      if(remains == 0) {
        return {
          value: result,
          rest: str
        };
      }
      var res = reader.feed(str);
      if(res === true) {
        str = '';
      } else {
        result.push(res.value);
        str = res.rest;
        remains --;
        reader.init(_context);
      }
    }
    return true;
  };

  this.eof = function() {
    if(remains == 1) {
      result.push(reader.eof());
      return result;
    } else if (remains == 0){
      return result;
    } else {
      throw "Unexpected EOF while reading array.";
    }
  };
};

module.exports = exports = ArrayReader;
