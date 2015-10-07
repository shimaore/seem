    check = (require 'assert').deepEqual
    bluebird = require 'bluebird'
    fs = bluebird.promisifyAll require 'fs'

    describe 'Generators', ->
      it 'should work as expected', (done) ->
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
        done()

    describe 'seem', ->
      seem = require '../index'
      it 'should work with readFileAsync', (done) ->

        make_generator_2 = (x) ->
          a = parseInt yield fs.readFileAsync x
          check a, 4
          b = parseInt yield fs.readFileAsync 'test/3plus'+a
          check b, 7
          fs.readFileAsync 'test/bar'+b, encoding:'utf-8'

        g = seem make_generator_2

        d = g 'test/four'
        d.then (x) ->
          check x, 'foo\n'
          done()

      it 'should work with Promise.resolve', (done) ->
        h = (tidbit) ->
          Promise.resolve tidbit is 45

        i = seem (tidbit) ->
          a = yield h tidbit
          if a is true then 'worked' else 'failed'

        v = i(45)
        v.then (a) ->
          check a, 'worked'
          done()

Make sure we can get Promise errors as well.

      it 'should report errors', (done) ->
        j = ->
          Promise.reject new Error 'Crash'

        k = seem ->
          try
            a = yield j()
          catch error
            error

        k().then (v) ->
          check v.message, 'Crash'
          done()

      it 'should work with classes', (done) ->

        class Foo
          constructor: (@v) ->

          bar: seem (tidbit) ->
            a = yield Promise.resolve @v
            {r:a - tidbit}

        m = new Foo 45
        m.bar(45).then (v) ->
          check v.r, 0

          m.bar(42).then (v) ->
            check v.r, 3
            done()

      it 'should work with the example from the README', (done) ->

        g = seem (n) ->
          a = yield Promise.resolve n+4
          b = yield Promise.resolve a+5
          b+3

        g(2).then (result) ->
          check result, 2+4+5+3
          done()

      it 'should handle non-Promise values', (done) ->
        g = seem ->
          a = yield 5
          a+2

        g().then (result) ->
          check result, 7
          done()
