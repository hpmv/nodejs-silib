var ArrayReader = require("./ArrayReader.js"),
  IntReader = require("./IntReader.js"),
  ObjectReader = require("./ObjectReader.js"),
  DecimalReader = require('./DecimalReader.js'),
  StringReader = require('./StringReader.js'),
  CharReader = require('./CharReader.js'),
  LineReader = require('./LineReader.js'),
  Context = require("./Context.js");

var type_readers = {
  'd': new IntReader(),
  'f': new DecimalReader(),
  's': new StringReader(),
  'c': new CharReader(),
  'l': new LineReader()
};


/*
<type_exp> ::= (':' <type>) ? ('[' <expr> ']')*
<field_exp> ::= <id> <type_exp>
<obj_exp> ::= '{' (<field_exp> (',' <field_exp>)*)? '}'
<type> ::= 'd' | 's' | 'c' | 'f' | 'l' | <obj_exp>
<input_exp> ::= (<field_exp> (',' <field_exp>)*)?

 */

var parse = function(input) {
  var pt = 0;

  function read() {
    return input[pt++];
  }

  function peek() {
    return input[pt];
  }

  function eof() {
    return pt==input.length;
  }

  function putback() {
    pt--;
  }

  function read_id() {
    var buffer = "";
    while(!eof()){
      var x = read();
      if(x>='A' && x<='Z' || x>='a' && x<='z' || x=='_') {
        buffer+=x;
      } else {
        putback();
        return buffer;
      }
    }
    return buffer
  }

  function read_exp() {
    var buffer = "";
    while(!eof()) {
      var x = read();
      if(x==']') {
        putback();
        return buffer;
      }
      buffer+=x;
    }
    return buffer;
  }

  function consume(expected) {
    if(eof()) {
      return false;
    }
    var x = read();
    if(x==expected) {
      return true;
    } else {
      putback();
      return false;
    }
  }

  function expect(expected) {
    if(eof()) {
      throw "Expected: "+expected+", actual: (EOF)";
    }
    if(consume(expected)) {
      return;
    } else {
      throw "Expected: "+expected+", actual: "+peek();
    }
  }

  function id() {
    return read_id();
  }

  function type() {
    if(!eof() && peek() == '{') {
      return obj_exp();
    }
    var t = read_id();
    if(t=='d' || t=='s' || t=='c' || t=='f' || t=='l') return type_readers[t];
    throw "Invalid type: "+t;
  }

  function type_exp() {
    var reader = type_readers['d'];
    if(consume(':')) {
      reader = type();
    }
    while(consume('[')) {
      var exp = read_exp();
      reader = new ArrayReader(reader, exp);
      expect(']');
    }
    return reader;
  }

  function field_exp() {
    var name = id();
    var reader = type_exp();
    return {
      name: name,
      reader: reader
    };
  }

  function obj_exp() {
    var readerList = [];
    expect('{');
    while(!consume('}')) {
      readerList.push(field_exp());
      consume(',');
    }
    return new ObjectReader(readerList);
  }

  function input_exp() {
    var readerList = [];
    while(!eof()) {
      readerList.push(field_exp());
      consume(',');
    }
    return readerList;
  }

  return input_exp();

};

module.exports = exports = parse;