/* eslint-env mocha */
import { expect } from 'chai'
import fs from 'fs-extra'

import main from '../src/cmd/main'

describe('cmd - main', function() {
    let tmp

    before(function() {
        tmp = process.argv
    })

    beforeEach(function() {
        fs.emptyDirSync('test/tmp')
    })

    after(function() {
        process.argv = tmp
    })

    it('should work', function() {
        process.argv = [
            'node',
            'emilia',
            '--src',
            'test/fixtures/css/custom.css',
            '--dest',
            'test/tmp/',
            '--output',
            'test/tmp',
            '--cssPath',
            '',
            '--prefix',
            '',
            '--algorithm',
            'top-down',
            '--padding',
            '10',
            '--convert',
            '2',
            '--decimal',
            '2',
            '--unit',
            'px',
            '--quiet',
            'false'
        ]

        expect(main).to.not.throw(Error)

        expect('test/tmp/sprite.png').to.be.exist
        expect('test/tmp/custom.css').to
            .have.selector('.icon0').and.decl({
                background: '#ccc url(\'sprite.png\') no-repeat',
                'background-position': '0px -55px',
                'background-size': '128px 183px'
            })
            .and.have.selector('.icon2').and.decl({
                background: 'url(\'sprite.png\') no-repeat',
                'background-position': '0px 0px',
                'background-size': '128px 183px'
            })
    })

    it('should work with empty src', function() {
        process.argv = [
            'node',
            'emilia',
            '--src',
            '',
            '--dest',
            'test/tmp/',
            '--output',
            'test/tmp',
            '--cssPath',
            '',
            '--prefix',
            '',
            '--algorithm',
            'top-down',
            '--padding',
            '10',
            '--convert',
            '2',
            '--decimal',
            '2',
            '--unit',
            'px',
            '--quiet',
            'false'
        ]

        expect(main).to.not.throw(Error)

        expect('test/tmp/sprite.png').to.not.be.exist
        expect('test/tmp/custom.css').to.not.be.exist
    })

    it('should work with abbreviation', function() {
        process.argv = [
            'node',
            'emilia',
            '-s',
            'test/fixtures/css/custom.css',
            '-d',
            'test/tmp/',
            '-o',
            'test/tmp',
            '--cssPath',
            '',
            '--prefix',
            '',
            '--algorithm',
            'top-down',
            '--padding',
            '10',
            '--convert',
            '2',
            '--decimal',
            '2',
            '--unit',
            'px',
            '--quiet',
            'false'
        ]

        expect(main).to.not.throw(Error)

        expect('test/tmp/sprite.png').to.be.exist
        expect('test/tmp/custom.css').to
            .have.selector('.icon0').and.decl({
                background: '#ccc url(\'sprite.png\') no-repeat',
                'background-position': '0px -55px',
                'background-size': '128px 183px'
            })
            .and.have.selector('.icon2').and.decl({
                background: 'url(\'sprite.png\') no-repeat',
                'background-position': '0px 0px',
                'background-size': '128px 183px'
            })
    })
})
