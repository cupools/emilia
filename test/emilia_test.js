/* global describe,it,before */

'use strict';

let assert = require('assert');
let fs = require('fs-extra');
let postcss = require('postcss');

let Emilia = require('../main.js');
let emilia = null;

describe('Different Options', function() {

    describe('with single stylesheet', function() {

        before(function() {
            fs.emptyDirSync('test/tmp');
        });

        it('#run()', function() {
            assert.doesNotThrow(function() {
                emilia = new Emilia({
                    src: ['test/fixtures/css/main.css'],
                    dest: 'test/tmp/',
                    output: 'test/tmp/',
                    cssPath: '../images/',
                    quiet: true
                });
                emilia.run();

            }, 'should run without exception');
        });

        it('output stylesheet', function() {
            let css = '';

            assert.doesNotThrow(function() {
                css = fs.readFileSync('test/tmp/main.css', 'utf8');
            }, 'should output css file');

            let map = getMap('main');
            let picInfo = getPicInfo();
            postcss.parse(css).walkRules(checkStylesheet.bind(this, map, picInfo));
        });

        it('output sprite', function() {
            assert.doesNotThrow(function() {
                fs.statSync('test/tmp/sprite-tom.png');
                fs.statSync('test/tmp/sprite-jerry.png');
            }, 'should output sprite file');
        });
    });

    describe('with multi stylesheet', function() {

        before(function() {
            fs.emptyDirSync('test/tmp');
        });

        it('#run()', function() {
            assert.doesNotThrow(function() {
                emilia = new Emilia({
                    src: ['test/fixtures/css/multi_*.css'],
                    dest: 'test/tmp/',
                    output: 'test/tmp/',
                    cssPath: '../images/',
                    quiet: true
                }); 
                emilia.run();

            }, 'should run without exception');
        });

        it('output stylesheet', function() {
            let one = '';
            let two = '';

            assert.doesNotThrow(function() {
                one = fs.readFileSync('test/tmp/multi_one.css', 'utf8');
                two = fs.readFileSync('test/tmp/multi_two.css', 'utf8');
            }, 'should output css file');

            let map = getMap('multi');
            let picInfo = getPicInfo();

            postcss.parse(one).walkRules(checkStylesheet.bind(this, map, picInfo));
            postcss.parse(two).walkRules(checkStylesheet.bind(this, map, picInfo));
        });

        it('output sprite', function() {
            assert.doesNotThrow(function() {
                fs.statSync('test/tmp/sprite-tom.png');
                fs.statSync('test/tmp/sprite-jerry.png');
            }, 'should output sprite file');
        });
    });

    describe('with rem stylesheet', function() {

        before(function() {
            fs.emptyDirSync('test/tmp');
        });

        it('#run()', function() {
            assert.doesNotThrow(function() {
                emilia = new Emilia({
                    src: ['test/fixtures/css/rem.css'],
                    dest: 'test/tmp/',
                    output: 'test/tmp/',
                    cssPath: './',
                    prefix: '',
                    algorithm: 'top-down',
                    padding: 100,
                    unit: 'rem',
                    convert: 16,
                    quiet: true
                });
                emilia.run();

            }, 'should run without exception');
        });

        it('output stylesheet', function() {
            let css = '';

            assert.doesNotThrow(function() {
                css = fs.readFileSync('test/tmp/rem.css', 'utf8');
            }, 'should output css file');

            postcss.parse(css).walkDecls(/background/, function(decl) {
                if(decl.prop === 'background') {
                    let url = /url\(([\w\W]+?)\)/.exec(decl.value)[1];
                    assert.equal(url, './sprite.png', 'background url should be replace correct');

                } else if(decl.prop === 'background-size') {
                    assert.equal(decl.value, '16rem 28.5rem', 'background size should be convert correct');
                }
                
            });
        });

        it('output sprite', function() {
            assert.doesNotThrow(function() {
                fs.statSync('test/tmp/sprite.png');
            }, 'should output sprite file');
        });
    });
});

function checkStylesheet(map, picInfo, rule) {
    if(rule.selector.indexOf('icon') > -1) {
        let idx = +rule.selector[5];
        let tag = map[rule.selector].tag;

        rule.walkDecls(/background(-image)?$/, function(decl) {
            let url = /url\(([\w\W]+?)\)/.exec(decl.value)[1];

            if(tag === 'inline') {
                assert.ok(url.indexOf('base64') > -1, 'picture should be encode to base64');
            } else {
                assert.equal(url, '../images/sprite-' + tag + '.png', 'background url should be replace correct');
            }
        });

        rule.walkDecls(/background-size/, function(decl) {
            let size = picInfo[idx];

            if(tag !== 'inline') {
                assert.notEqual(decl.value, size[0] + 'px ' + size[1] + 'px', 'background size should be replace');
            }
        });

        rule.walkDecls(/background-position/, function() {
            let flag = false;

            if(tag !== 'inline') {
                flag = true;
            }

            assert.ok(flag || tag === 'inline', 'background position should be append base on inline');
        });

    } else if(rule.selector.indexOf('unexist') > -1) {
        rule.walkDecls(/background(-image)?$/, function(decl) {
            let url = /url\(([\w\W]+?)\)/.exec(decl.value)[1];
            assert.ok(url.indexOf('undefined') > -1, 'picture unexist should not be replace');
        });
    }
}

function getMap(type) {
    let map = {
        main: {
            '.icon0': {tag: 'tom'},
            '.icon1': {tag: 'tom'},
            '.icon2': {tag: 'inline'},
            '.icon3': {tag: 'tom'},
            '.icon4': {tag: 'tom'},
            '.icon5': {tag: 'jerry'},
            '.icon6': {tag: 'jerry'},
            '.icon7': {tag: 'inline'}
        },
        multi: {
            '.icon0': {tag: 'tom'},
            '.icon1': {tag: 'tom'},
            '.icon2': {tag: 'tom'},
            '.icon3': {tag: 'tom'},
            '.icon4': {tag: 'tom'},
            '.icon5': {tag: 'jerry'},
            '.icon6': {tag: 'jerry'},
            '.icon7': {tag: 'jerry'}
        },
        rem: {
            '.icon0': {tag: 'tom'}
        }
    };
    return map[type || 'main'];
}

function getPicInfo() {
    return {
        '0': [128, 128],
        '1': [128, 128],
        '2': [50, 50],
        '3': [128, 128],
        '4': [128, 128],
        '5': [200, 75],
        '6': [75, 150],
        '7': [100, 100]
    };
}