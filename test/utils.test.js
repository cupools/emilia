/* eslint-env mocha */
import { expect } from 'chai'

import assert from '../src/utils/assert'

describe('Utils', function() {
    describe('assert.typeOf', function() {
        it('shoud work', function() {
            expect(assert.typeOf(1, Number)).to.be.true
            expect(assert.typeOf([], Array)).to.be.true
            expect(assert.typeOf(1, String)).to.be.false
            expect(assert.typeOf([], Object)).to.be.false
        })
    })

    describe('assert.oneOf', function() {
        it('shoud work', function() {
            expect(assert.oneOf(1, [1, 2])).to.be.true
            expect(assert.oneOf('1', [2, '1'])).to.be.true
            expect(assert.oneOf(1, [2, 3])).to.be.false
        })
    })

    describe('assert.isNotNull', function() {
        it('shoud work', function() {
            expect(assert.isNotNull(1)).to.be.true
            expect(assert.isNotNull(null)).to.be.false
            expect(assert.isNotNull(undefined)).to.be.false
        })
    })
})
