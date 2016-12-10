/* eslint-env mocha */

import * as methods from '../src/methods'
import { should } from './common'

describe('methods', function () {
  describe('.resolveUrl', function () {
    it('should work', function () {
      methods.resolveUrl('foo.png').should.equal('foo.png')
    })
  })

  describe('.detectUrl', function () {
    it('should work', function () {
      methods.detectUrl('foo.png?__sprite').should.deep.eql({
        url: 'foo.png',
        tag: 'sprite',
        seperator: '?__',
        raw: 'foo.png?__sprite'
      })
    })

    it('should return null with unexpect url', function () {
      should.equal(methods.detectUrl('foo.png?#sp'), null)
    })
  })

  describe('.getUrls', function () {
    it('should work', function () {
      methods.getUrls('.foo { background: url("icon.png"); }')
        .should.have.property('urls')
        .that.have.deep.property('[0].url', 'icon.png')

      methods.getUrls('.foo { background: url(icon.png?__sprite); }')
        .should.have.property('urls')
        .that.have.deep.property('[0].url', 'icon.png?__sprite')
    })

    it('should get url from background', function () {
      methods.getUrls('.foo { background: #ddd url(icon.png?__sprite) no-repeat; }')
        .should.have.property('urls')
        .that.have.deep.property('[0].url', 'icon.png?__sprite')
    })

    it('should get url from background-image', function () {
      methods.getUrls('.foo { background-image: url(icon.png?__sprite) }')
        .should.have.property('urls')
        .that.be.lengthOf(1)
    })
  })

  describe('.getBuffer', function () {
    it('should work', function () {
      should.exist(methods.getBuffer('test/fixtures/images/0.png'))
    })
  })

  describe('.getID', function () {
    it('should work', function () {
      methods.getID([0, 1, 2], 1).should.equal(1)
    })
  })

  describe('.getGroup', function () {
    it('should work', function () {
      const all = [{ tag: 0 }, { tag: 0 }, { tag: 1 }]
      methods.getGroup(all, 0).should.deep.eql([0, 1])
      methods.getGroup(all, 1).should.deep.eql([2])
    })
  })
})
