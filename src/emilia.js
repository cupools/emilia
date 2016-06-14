'use strict';

import fs from 'fs-extra';
import glob from 'glob';
import postcss from 'postcss';
import log from './utils/log';
import _ from './utils/util';
import * as File from './file';
import * as sprite from './sprite';

const urlReg = /(?:url\s?\(['"]?([\w\W]+?)(?:\?(__)?([\w\d\-_]+?))?['"]?\))/;
const replaceUrlReg = /(url\s?\(['"]?)([\w\W]+?)(['"]?\))/;
const declFilter = /(-webkit-)?background-(size|repeat)/;
const inlineTag = 'inline';

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
            unit: 'px',
            convert: 1
        }, options);

        this.File = File;
    }

    run() {
        this._initStyle();
        this._buildSprite();
        this._outputImage();
        this._outputStyle();
    }

    _initStyle() {
        this._getResource().map(p => {
            let f = this.initStyle(p);
            this._handleStyle(f);
        });
    }

    initStyle(realpath) {
        return File.wrap({
            realpath,
            type: 'STYLE',
            content: fs.readFileSync(realpath, 'utf8')
        });
    }

    _handleStyle(file) {
        let processor = postcss();
        processor.use(this._walkDecls.bind(this, file));
        file.content = processor.process(file.content).css;
    }

    _walkDecls(file, css) {
        css.walkDecls(this._traverseFilter(file, (decl, file, group) => {
            let url = group[1];
            let tag = group[3];
            let realpath = this._getImageRealpath(url, file.realpath);

            if(_.exists(realpath)) {
                if(tag === inlineTag) {
                    let encode = this._encode(realpath);
                    decl.value = decl.value.replace(replaceUrlReg, `$1${encode}$3`);
                } else {
                    sprite.add(realpath, tag);
                }

            } else {
                decl.value = decl.value.replace(/\?__\w+/, '');
                log.warn(url + ' not exsit');
            }
        }));
    }

    _traverseFilter(file, callback) {
        return decl => {
            if(decl.prop.indexOf('background') !== -1) {
                let group = urlReg.exec(decl.value);

                if(group && group[2]) {
                    callback(decl, file, group);
                }
            }
        };
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

        css.walkDecls(this._traverseFilter(file, (decl, file, group) => {
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
            decl.value = decl.value.replace(urlReg, `url(${url})`);

            let parent = decl.parent;

            parent.walkDecls(decl => {
                if(declFilter.test(decl.prop)) {
                    decl.remove();
                }
            });
            parent.append(pos);
            parent.append(size);
        }));

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

    _encode(realpath) {
        let base64 = fs.readFileSync(realpath, {encoding: 'base64'});
        let name = _.basename(realpath);
        return `data:image/${name};base64,${base64}`;
    }
}

export default function(options) {
    return new Emilia(options);
}