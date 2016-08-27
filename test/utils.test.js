/* eslint-env mocha */
import { expect } from 'chai'

import assert from '../src/utils/assert'

describe('Utils', function() {
    describe('assert.typeOf', function() {
        it('shoud work', function() {
            expect(assert.typeOf(1, Number, 'should be number')).to.be.true
            expect(assert.typeOf([], Array), 'should be array').to.be.true
            expect(assert.typeOf(1, String), 'should be string').to.be.false
            expect(assert.typeOf([], Object), 'should be object').to.be.false
        })
    })

    describe('assert.oneOf', function() {
        it('shoud work', function() {
            expect(assert.oneOf(1, [1, 2], 'should be one of [1, 2]')).to.be.true
            expect(assert.oneOf('1', [2, '1'], 'should be one of [2, \'1\']')).to.be.true
            expect(assert.oneOf(1, [2, 3], 'should be one of [2, 3]')).to.be.false
        })
    })

    describe('assert.isNotNull', function() {
        it('shoud work', function() {
            expect(assert.isNotNull(1, 'should not be null')).to.be.true
            expect(assert.isNotNull(null, 'should be null')).to.be.false
            expect(assert.isNotNull(undefined, 'should be null')).to.be.false
        })
    })
})
