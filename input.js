var parse = require('./parse.js');
var ObjectReader = require('./ObjectReader.js');
var Context = require('./Context.js');

var input = function(format, callback) {
  var helpers = {
    print: function(data) {
      process.stdout.write(''+data);
    }
  };
  var readerList = parse(format);
  var reader = new ObjectReader(readerList);
  var docallback = function(result) {
    var resultList = [];
    for (var i=0;i<readerList.length;i++) {
      resultList.push(result[readerList[i].name]);
    }
    callback.apply(helpers, resultList);
  };
  reader.init(new Context());
  process.stdin.setEncoding('UTF-8');
  process.stdin.on('data', function(data) {
    var x = reader.feed(data);
    if(x !== true) {
      docallback(x.value);
    }
  });
  process.stdin.on('end', function() {
    var x = reader.eof();
    docallback(x);
  });
  process.stdin.resume();
};

module.exports = exports = input;