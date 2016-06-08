'use strict';

let assert = require('assert');
let fs = require('fs-extra');

describe('sprites.js', function() {
});

describe('task.js', function() {
    let Task = require('../lib/task.js').default;
    let task = new Task({
        src: ['test/fixtures/**/one.css']
    });

    task.run();

    it('_getResource', function() {
        assert.ok(task._getResource().length);
        assert.ok(task._getResource()[0].indexOf('emilia') > -1);
    });

});

describe('utils.js', function() {
    let _ = require('../lib/utils/util').default;

    it('basename', function() {
        assert.equal(_.basename('/a/c/v/a.png'), 'a.png');
        assert.equal(_.basename('/a/c/v/a'), 'a');
    });

    it('name', function() {
        assert.equal(_.name('/a/c/v/a.png'), 'a');
        assert.equal(_.name('/a/c/v/a'), 'a');
    });

    it('resolvePath', function() {
        assert.ok(_.resolvePath('a.png').indexOf('emilia/a.png') > -1);
        assert.ok(_.resolvePath('b', 'c', 'a.png').indexOf('emilia/b/c/a.png') > -1);
    });

    it('exists', function() {
        assert.ok(_.exists('package.json'));
        assert.ifError(_.exists('unexist'));
    })
});