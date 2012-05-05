var codejam = require('./codejam.js');
var util = require('util');
//A+B:
//codejam('a,b',function(a,b){this.print(a+b);});

//with testinput.txt:
codejam('N,data:{a,b,c,arr:s[c]}[N]', function(N, data) {
  this.print(JSON.stringify({N:N,data:data}));
});