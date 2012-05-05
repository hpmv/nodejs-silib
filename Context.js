var Context = function(parentContext) {
  this._variables = {};
  if(parentContext !== undefined) {
    for (var name in parentContext._variables) {
      this._variables[name] = parentContext._variables[name];
    }
  }
  this.get = function(name) {
    if(name in this._variables)
      return this._variables[name];
    else
      throw "Context doesn't contain: "+name;
  };
  this.set = function(name, value) {
    this._variables[name] = value;
  };
  this.evaluate = function(func) {
    return func.call(this);
  };
};

Context.compile = function(expr) {
  return new Function("with(this._variables){return "+expr+";}");
};

module.exports = exports = Context;
