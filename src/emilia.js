'use strict';

import fs from 'fs-extra';
import glob from 'glob';
import postcss from 'postcss';
import * as File from './file';
import * as sprite from './sprite';
import _ from './utils/util';

const urlReg = /(?:url\(['"]?([\w\W]+?)(?:\?(__)?([\w\W]+?))?['"]?\))/;
const declFilter = /(-webkit-)?background-(size|repeat)/;

class Emilia {
    constructor(options) {
        this.options = Object.assign({
            src: ['*.css'],
            dest: './',
            output: './components/images/',
            cssPath: '../components/images/',
            prefix: 'sprite-',
            algorithm: 'binary-tree',
            padding: 10,
            sizeLimit: 5 * 1024,
            unit: 'px',
            convert: 1
        }, options);

        this.File = File;
    }

    run() {
        this._initStyle();
        this._initImage();
        this._buildSprite();
        this._outputImage();
        this._outputStyle();
    }

    _initStyle() {
        this._getResource().map(p => {
            let f = this.initStyle(p);
            this._scanStyle(f);
        });
    }

    initStyle(realpath) {
        return File.wrap({
            realpath,
            type: 'STYLE',
            content: fs.readFileSync(realpath, 'utf8')
        });
    }

    _scanStyle(file) {
        let processor = postcss();
        processor.use(this._walkDecls.bind(this, file));
        processor.process(file.content).catch();
    }

    _walkDecls(file, css) {
        css.walkDecls(decl => {
            if(decl.prop.indexOf('background') !== -1) {
                let group = urlReg.exec(decl.value);

                if(group && group[2]) {
                    let url = group[1];
                    let tag = group[3];

                    let realpath = this._getImageRealpath(url, file.realpath);
                    sprite.add(realpath, tag);
                }
            }
        });
    }

    _initImage() {
        let map = sprite.get();
        _.forIn(map, val => _.uniq(val).map(this.initImage));
    }

    initImage(realpath) {
        return File.wrap({
            realpath,
            type: 'IMAGE',
            content: fs.readFileSync(realpath, 'binary')
        });
    }

    _buildSprite() {
        let opt = this.options;

        sprite.build(opt, sp => {
            let path = _.joinPath(opt.output, opt.prefix + sp.tag + '.png');
            let content = new Buffer(sp.image);

            File.wrap({
                path,
                content,
                id: sp.tag,
                type: 'SPRITE',
                meta: {
                    width: sp.properties.width,
                    height: sp.properties.height,
                    coordinates: sp.coordinates
                }
            });
        });
    }

    _outputImage() {
        let sprites = File.getSprites();
        _.forIn(sprites, file => this.outputImage(file));
    }

    _outputStyle() {
        let processor = postcss();
        let styles = File.getStyles();

        _.forIn(styles, file => {
            processor.use(this._updateDecls.bind(this, file));
            file.content = processor.process(file.content).css;

            this.outputStyle(file);
        });
    }

    _updateDecls(file, css) {
        let opt = this.options;

        css.walkDecls(decl => {
            if(decl.prop.indexOf('background') !== -1) {
                let val = decl.value;
                let group = urlReg.exec(val);

                if(group && group[2]) {
                    let url = group[1];
                    let tag = group[3];

                    let realpath = this._getImageRealpath(url, file.realpath);
                    let sprite = File.getFile(tag);
                    let meta = sprite.meta;
                    let chip = meta.coordinates[realpath];

                    let pos = postcss.decl({
                        prop: 'background-position',
                        value: `${-chip.x/opt.convert}${opt.unit} ${-chip.y/opt.convert}${opt.unit}`
                    });
                    let size = postcss.decl({
                        prop: 'background-size',
                        value: `${meta.width/opt.convert}${opt.unit} ${meta.height/opt.convert}${opt.unit}`
                    });

                    url = sprite.url || `${opt.cssPath}${opt.prefix}${tag}.png`;
                    decl.value = val.replace(urlReg, `url(${url})`);

                    let parent = decl.parent;

                    parent.walkDecls(decl => {
                        if(declFilter.test(decl.prop)) {
                            decl.remove();
                        }
                    });
                    parent.append(pos);
                    parent.append(size);
                }
            }
        });
    }

    outputStyle(file) {
        let opt = this.options;
        let name = _.basename(file.realpath);
        let outputPath = _.resolvePath(opt.dest + name);

        fs.outputFileSync(outputPath, file.content, 'utf8');
    }

    outputImage(file) {
        let opt = this.options;
        let name = file.id;
        let outputPath = _.resolvePath(opt.output, opt.prefix + name  + '.png');

        fs.outputFileSync(outputPath, file.content, 'binary');
    }

    _getImageRealpath(url, stylePath) {
        return _.joinPath(stylePath, '../' ,url);
    }

    _getResource() {
        let styles = [];
        let opt = this.options;

        opt.src.map(f => {
            styles.push(...glob.sync(f).map(p => _.resolvePath(p)));
        });

        return styles;
    }
}

export default function(options) {
    return new Emilia(options);
}