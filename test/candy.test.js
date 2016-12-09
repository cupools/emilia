/* eslint-env mocha */

import path from 'path'
import del from 'del'
import candy from '../src/candy'
import './common'

describe('candy', function () {
  beforeEach(function () {
    del.sync('test/tmp')
  })

  it('should work', function () {
    const options = {
      src: 'test/fixtures/css/custom.css',
      dest: 'test/tmp/output.css',
      output: 'test/tmp/img/',
      resolveUrl: url => path.join(__dirname, 'fixtures/css', url)
    }
    candy(options)
  })
})
