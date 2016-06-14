/* global describe,it */

'use strict';

let assert = require('assert');
let fs = require('fs-extra');
let _ = require('lodash');

let Emilia = require('../main.js');
let emilia = new Emilia({
    src: ['test/fixtures/**/*.css'],
    dest: 'test/tmp/',
    output: 'test/tmp/'
});

emilia.run();

describe('emilia.js', function() {
    it('_getResource', function() {
        assert.ok(emilia._getResource().length);
    });
});

describe('file.js', function() {
    let File = require('../lib/file.js').default;

    it('getFile', function() {
        assert.ok(File.getFile('tom').content);
        assert.ok(File.getFile('jerry').content);
    });

    it('getStyles', function() {
        let styles = File.getStyles();
        let len = 0;

        _.forIn(styles, function(file) {
            assert.equal(file.type, 'STYLE');
            assert.ok(file.content.length);
            len += 1;
        });

        assert.equal(len, 3);
    });

    it('getSprites', function() {
        let styles = File.getSprites();
        let len = 0;

        _.forIn(styles, function(file) {
            assert.equal(file.type, 'SPRITE');
            assert.ok(file.content.length);
            len += 1;
        });

        assert.equal(len, 2);
    });
});

describe('utils/util.js', function() {
    let _ = require('../lib/utils/util').default;

    it('basename', function() {
        assert.equal(_.basename('/a/c/v/a.png'), 'a.png');
        assert.equal(_.basename('/a/c/v/a'), 'a');
    });

    it('name', function() {
        assert.equal(_.name('/a/c/v/a.png'), 'a');
        assert.equal(_.name('/a/c/v/a'), 'a');
    });

    it('resolve', function() {
        assert.ok(_.resolve('a.png').indexOf('emilia/a.png') > -1);
        assert.ok(_.resolve('b', 'c', 'a.png').indexOf('emilia/b/c/a.png') > -1);
    });

    it('relative', function() {
        let path = require('path');
        assert.equal(_.relative('a', 'b', 'c.png'), path.relative('a', 'b', 'c.png'));
    });

    it('join', function() {
        let path = require('path');
        assert.equal(_.join('a', 'b', 'c.png'), path.join('a', 'b', 'c.png'));
    });

    it('exists', function() {
        assert.ok(_.exists('package.json'));
        assert.ifError(_.exists('unexist'));
    });
});