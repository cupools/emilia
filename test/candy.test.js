/* eslint-env mocha */

import path from 'path'
import candy from '../src/candy'
import './common'

describe('candy', function () {
  it('should work', function () {
    const options = {
      src: 'test/fixtures/css/custom.css',
      dest: 'test/fixtures/tmp',
      output: 'test/fixtures/tmp',
      resolveUrl: url => path.join(__dirname, 'fixtures/css', url)
    }
    candy(options)
  })
})
