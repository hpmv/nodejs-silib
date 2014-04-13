input = require './input.js'
parse = require './parse.js'

solve = (format, callback, handle=null, debug=false) ->
  debug = !!debug
  jam =
    print: (data) ->
      process.stdout.write "#{data}"
    debug: (data) ->
      if debug
        process.stderr.write "#{data}\n"
  if handle?
    for k of jam
      handle[k] = jam[k]
  readerList = parse format
  input "_NC,cases:{#{format}}[_NC]", (_NC, cases) ->
    for i in [0..._NC]
      jam.print "Case ##{i+1}: "
      if debug
        jam.debug "DEBUG for Case ##{i+1}:"
      onecase = cases[i]
      args = []
      for j in [0...readerList.length]
        args.push onecase[readerList[j].name]
      callback.apply jam,args
      jam.print '\n'
    process.stdin.removeAllListeners()
    process.stdin.destroy()

parallelsolve = (threads, format, callback, debug=false) ->
  Parallel = require 'paralleljs'
  debug = !!debug
  readerList = (x.name for x in parse format)
  input "_NC,cases:{#{format}}[_NC]", (_NC, cases) ->
    cases = ((c[name] for name in readerList) for c in cases)
    new Parallel(cases, {maxWorkers: threads})
      .require({fn: callback, name: 'codejamCallback'})
      .map (data) ->
        stdout = ''
        stderr = ''
        jam =
          print: (data) -> stdout += "#{data}"
          debug: (data) -> stderr += "#{data}\n"
        codejamCallback.apply jam, data
        jam.print '\n'
        return [stdout, stderr]
      .then (output) ->
        for [out,err],i in output
          process.stdout.write "Case ##{i+1}: #{out}"
          if debug
            process.stdout.write "DEBUG for Case ##{i+1}:\n#{err}"
    process.stdin.removeAllListeners()
    process.stdin.destroy()

codejam = (format, callback, debug) -> solve(format, callback, debug)
codejam.parallel = parallelsolve

for arg,i in process.argv
  if arg == '-j'
    numthreads = parseInt process.argv[i+1]
    codejam = (format, callback, debug) -> parallelsolve(numthreads, format, callback, debug)
module.exports = exports = codejam