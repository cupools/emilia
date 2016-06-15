/* global describe,it,before */

'use strict';

let assert = require('assert');
let fs = require('fs-extra');
let path = require('path');
let _ = require('lodash');

let Emilia = require('../main.js');
let emilia = new Emilia({
    src: ['test/fixtures/**/!(rem).css'],
    dest: 'test/tmp/',
    output: 'test/tmp/',
    quiet: true
});

describe('Base Function', function() {
    
    before(function() {
        fs.emptyDirSync('test/tmp');
    });

    describe('emilia.js', function() {

        it('run', function() {
            assert.doesNotThrow(function() {
                emilia.run();
            }, 'should run without exception');
        });

        it('_traverseFilter', function() {
            let rt = [{
                prop: 'background',
                value: 'url(a/b/c.png?__test)'
            }, {
                prop: 'background-image',
                value: 'url(a/b/c.png?__test)'
            }, {
                prop: 'background',
                value: 'url(a/b/c.png?v1)'
            }, {
                prop: 'background',
                value: 'url(a/b/c.png?__)'
            }, {
                prop: 'image',
                value: 'url(a/b/c.png?__test)'
            }];

            rt.map(emilia._traverseFilter({}, function(decl, file, group) {
                assert.ok(decl.prop.indexOf('background') > -1, 'should correct filter prop');
                assert.equal(group[3], 'test', 'should get correct sprite\'s tag');
            }));
        });

        it('_getImageRealpath', function() {
            assert.equal(emilia._getImageRealpath('../image/c.png', 'css/style.css'), 'image/c.png', 'should get relative path');
        });

        it('_getResource', function() {
            assert.ok(emilia._getResource().length, 3, 'should has 3 stylesheet files');
        });

        it('_encode', function() {
            assert.equal(emilia._encode(path.resolve(__dirname, 'fixtures/images/7.png')), 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAAHaX54IAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo1NEFFNjAyMDYwMzQxMUU1QkMyOEI5RDU3QzU2ODI5QiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo1NEFFNjAyMTYwMzQxMUU1QkMyOEI5RDU3QzU2ODI5QiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjU0QUU2MDFFNjAzNDExRTVCQzI4QjlENTdDNTY4MjlCIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjU0QUU2MDFGNjAzNDExRTVCQzI4QjlENTdDNTY4MjlCIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+XY/08AAACw1JREFUeNpizKnq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', 'should get correct base64 encoding');
        });
    });

    describe('file.js', function() {
        let File = require('../lib/file.js').default;

        it('getFile', function() {
            assert.ok(File.getFile('tom').content, 'should get right file object');
            assert.ok(File.getFile('jerry').content, 'should get right file object');
        });

        it('getStyles', function() {
            let styles = File.getStyles();
            let len = 0;

            _.forIn(styles, function(file) {
                assert.equal(file.type, 'STYLE', 'style file should be `STYLE` type');
                assert.ok(file.content.length, 'content should be corrent wrap');
                len += 1;
            });

            assert.equal(len, 3, 'should wrap 3 stylesheet file object');
        });

        it('getSprites', function() {
            let styles = File.getSprites();
            let len = 0;

            _.forIn(styles, function(file) {
                assert.equal(file.type, 'SPRITE', 'sprite file shoud be `SPRITE` type');
                assert.ok(file.content.length, 'content should be corrent wrap as Buffer');
                len += 1;
            });

            assert.equal(len, 2, 'should contain 2 sprite file object');
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
            assert.equal(_.relative('a', 'b', 'c.png'), path.relative('a', 'b', 'c.png'));
        });

        it('join', function() {
            assert.equal(_.join('a', 'b', 'c.png'), path.join('a', 'b', 'c.png'));
        });

        it('exists', function() {
            assert.ok(_.exists('package.json'));
            assert.ifError(_.exists('unexist'));
        });
    });
});