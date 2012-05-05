var input = require('./input.js');
var parse = require('./parse.js');

var codejam = function(format, callback) {
  var debugon = false;
  var jam = {
    print: function(data) {
      process.stdout.write(''+data);
    },
    debug: function(data) {
      if (debugon)
        process.stderr.write(''+data);
    },
    debugon: function() {
      debugon = true;
    },
    debugoff: function() {
      debugon = false;
    }
  };
  var readerList = parse(format);
  input('_NC,cases:{'+format+'}[_NC]', function(_NC, cases) {
    for(var i=0;i<_NC;i++){
      jam.print("Case #"+(i+1)+": ");
      var onecase = cases[i];
      var args = [];
      for(var j=0;j<readerList.length;j++){
        args.push(onecase[readerList[j].name]);
      }
      callback.apply(jam, args);
      jam.print("\n");
    }
  });
};

module.exports = exports = codejam;