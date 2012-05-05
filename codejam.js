var input = require('./input.js');
var parse = require('./parse.js');

var codejam = function(format, callback, handle, debug) {
  var debugon = !!debug;
  var jam = {
    print: function(data) {
      process.stdout.write(''+data);
    },
    debug: function(data) {
      if (debugon)
        process.stderr.write(''+data+'\n');
    }
  };
  if (handle!=null) {
    for (var k in jam) handle[k] = jam[k];
  }
  var readerList = parse(format);
  input('_NC,cases:{'+format+'}[_NC]', function(_NC, cases) {
    for(var i=0;i<_NC;i++){
      jam.print("Case #"+(i+1)+": ");
      if(debugon) jam.debug("DEBUG for Case #"+(i+1)+":");
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