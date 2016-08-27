/* eslint-env mocha */
import { expect } from 'chai'
import help from '../src/cmd/help'

describe('cmd - help', function() {
    it('should work', function() {
        expect(help).to.not.throw(Error)
    })
})
