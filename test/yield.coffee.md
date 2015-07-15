FIXME Add tests for error conditions.

    check = (require 'assert').deepEqual
    Promise = require 'bluebird'
    fs = Promise.promisifyAll require 'fs'

    make_generator = (x) ->
      check x, 4
      a = yield x+3
      check a, 9
      null

    generator = make_generator 4

This brings us to the first yield.

    b = generator.next 8

The return value of `next` is the argument of `yield`.
It's unclear what the argument(s) of that first `next` are used for, since clear the argument to `make_generator` becomes the argument of its generating function.

    check b.value, 7
    check b.done, false

Since we are stopped `inside` the `yield`, return its value and continue until the next `yield` or `return`.

    c = generator.next 9

    check c.value, null
    check c.done, true

    seem = require '../index'

    make_generator = (x) ->
      a = parseInt yield fs.readFileAsync x
      check a, 4
      b = parseInt yield fs.readFileAsync '3plus'+a
      check b, 7
      fs.readFileAsync 'bar'+b, encoding:'utf-8'

    g = seem make_generator

    b = g 'four'
    b.then (x) ->
      check x, 'foo\n'
