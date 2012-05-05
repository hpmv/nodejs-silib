['ArrayReader', 'CharReader', 'DecimalReader', 'Context', 'LineReader',
  'ObjectReader', 'IntReader', 'StringReader'].forEach(function (r) {
    global[r] = require('./' + r + '.js');
  });

function testequal(obj1, obj2) {
  if (obj1 == obj2) return true;
  try {
    for (var key in obj1) if (!(key in obj2)) return false;
    for (var key in obj2) if (!(key in obj1)) return false;
    for (var key in obj1) {
      if (!testequal(obj1[key], obj2[key])) return false;
    }
    return true;
  } catch (e) {
    return false;
  }
}

function test(reader, input, output) {
  reader.init(new Context());
  var res = reader.feed(input);
  if (res === true) {
    res = {value:reader.eof()};
  }
  console.log("Output: " + JSON.stringify(res.value));
  console.log("Expected: " + JSON.stringify(output));
  console.log("Equal? " + (testequal(res.value, output) ? "YES" : "NO"));
}


//Test cases!
[
  [new IntReader(), '-4', -4],
  [new DecimalReader(), '-4.125', -4.125],
  [new StringReader(), 'abcdefg hijk', 'abcdefg'],
  [new LineReader(), 'abcdefg\n', 'abcdefg'],
  [new IntReader(), '4212abc', 4212],
  [new IntReader(), '1', 1],
  [new IntReader(), '0', 0],
  [new IntReader(), '12345678 123', 12345678],
  [new DecimalReader(), '-3. 8', -3],
  [new DecimalReader(), '3.', 3],
  [new DecimalReader(), '123abc', 123],
  [new IntReader(), '1-2', 1],
  [new LineReader(), '\n', ''],
  [new CharReader(), 'a', 'a'],
  [new CharReader(), ' a b', 'a'],
  [new ArrayReader(new CharReader(), 8), 'abc def gha ', ['a','b','c','d','e','f','g','h']],
  [new ArrayReader(new IntReader(), '4'), '12 34 2 -12', [12, 34, 2, -12]],
  [new ArrayReader(new DecimalReader(), '3'), '3.25 -34 0 -0.375', [3.25, -34, 0]],
  [new ArrayReader(new IntReader(), '0'), 'abcdefg', []],
  [new ArrayReader(new IntReader(), '2'), '1 2 3 4 5', [1, 2]],
  [new ArrayReader(new LineReader(), '2'), 'abc\r\ncde\r\n', ['abc', 'cde']],
  [new ArrayReader(new StringReader(), '3'), 'abc def ghi jkl', ['abc','def','ghi']],
  [new ArrayReader(new ArrayReader(new StringReader(), '3'), '2'), 'a b c d e f', [['a', 'b', 'c'],['d', 'e', 'f']]],
  [new ObjectReader([{name:'N', reader:new IntReader()},
    {name:'data', reader:new ArrayReader(new StringReader(), 'N')}]),
    '4\nabcd\nde\nef\ngh',
    {N:4, data:['abcd','de','ef','gh']}
  ]
].forEach(function (x) {
    test(x[0], x[1], x[2]);
  });