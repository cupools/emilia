/* eslint-env mocha */

import fs from 'fs'
import path from 'path'
import emilia from '../src/index'
import './common'

describe('index', function () {
  it('should work', function () {
    const options = {
      resolveUrl: url => path.join(__dirname, 'fixtures/css', url)
    }
    emilia(options, fs.readFileSync('test/fixtures/css/custom.css', 'utf8'))
  })
})
