var Context = require("./Context.js");

var ObjectReader = function (readerList) {
  var index, context;
  var obj = {};

  this.init = function (parentContext) {
    if (readerList.length > 0) {
      readerList[0].reader.init(context);
    }
    index = 0;
    context = new Context(parentContext);
    obj = {};
  };

  this.feed = function(str) {
    while(str != '') {
      if (index == readerList.length) {
        return {
          value: obj,
          rest: str
        };
      }
      var res = readerList[index].reader.feed(str);
      if(res === true) {
        str = '';
      } else {
        var name = readerList[index].name;
        obj[name] = res.value;
        context.set(name, res.value);
        str = res.rest;
        index ++;
        if (index < readerList.length) {
          readerList[index].reader.init(context);
        }
      }
    }
    return true;
  };

  this.eof = function() {
    if(index == readerList.length) {
      return obj;
    } else if(index == readerList.length - 1) {
      var val = readerList[index].reader.eof();
      obj[readerList[index].name] = val;
      return obj;
    } else {
      throw "Unexpected EOF while reading object field: "+readerList[index].name;
    }
  };
};

module.exports = exports = ObjectReader;
