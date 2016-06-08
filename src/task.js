'use strict';

import fs from 'fs-extra';
import glob from 'glob';
import postcss from 'postcss';
import spritesmith from 'spritesmith';
import * as file from './file';
import * as sprite from './sprite';
import _ from './utils/util';

const urlReg = /(?:url\(['"]?([\w\W]+?)(?:\?(__)?([\w\W]+?))?['"]?\))/;

class Task {
    constructor(options) {
        this.options = Object.assign({
            src: ['*.css'],
            dest: './',
            output: './',
            cssPath: '../images/',
            prefix: 'sprite-',
            algorithm: 'binary-tree',
            padding: 10,
            sizeLimit: 5 * 1024
        }, options);

        this.storage = {};
    }

    run() {
        this._initStyle();
        this._scanStyle();
        this._initImage();
        this._buildSprite();
    }

    _initStyle() {
        let style = this._getResource();

        style.map(this.initStyle);
    }

    _initImage() {
        let sprites = this.storage.sprites;
        let keys = Object.keys(sprites);

        keys.map(tag => {
            let images = _.uniq(sprites[tag]);

            images.map(p => {
                this.initImage(p);
            });
        });
    }

    initStyle(path) {
        let realPath = _.resolvePath(path);

        file.wrap({
            path,
            realPath,
            type: 'STYLE',
            content: fs.readFileSync(realPath, 'utf8')
        });
    }

    initImage(path) {
        let realPath = _.resolvePath(path);

        file.wrap({
            path,
            realPath,
            type: 'IMAGE',
            content: fs.readFileSync(realPath, 'binary')
        });
    }

    _scanStyle() {
        let styles = file.getStyles();
        let processor = postcss();

        this.storage.sprites = {};

        let keys = Object.keys(styles);
        keys.map(p => {
            let file = styles[p];

            processor.use(this._walkDecls.bind(this, file));
            processor.process(file.content).catch();
        });
    }

    _walkDecls(file, css) {
        let opt = this.options;
        let sprites = this.storage.sprites;

        css.walkDecls(decl => {
            if(decl.prop.indexOf('background') !== -1 && decl.value.indexOf('?__') !== -1) {
                let val = decl.value;
                let group = urlReg.exec(val);

                if(group && group[2]) {
                    let url = group[1];
                    let tag = group[3];

                    if(!sprites[tag]) {
                        sprites[tag] = [];
                    }

                    let realPath = _.joinPath(file.path, '../' ,url);
                    let p = _.relativePath(process.cwd(), realPath);

                    sprites[tag].push(p);

                    decl.value = val.replace(urlReg, `url(${opt.cssPath}${tag}.png)`);
                }
            }
        });
    }

    _buildSprite() {
        let sprites = this.storage.sprites;
        let keys = Object.keys(sprites);
        let opt = this.options
        // console.log(sprites);

        keys.map(tag => {
            let sp = sprites[tag].map(f => {
                return _.resolvePath(f);
            });
            let ret = sprite.processSprite({
                sprites: sp,
                options: opt
            });

        });

    }

    outputStyle(file) {

    }

    outputImage(file) {

    }

    _getResource() {
        let style = [];
        let opt = this.options;

        opt.src.map(f => {
            style.push(...glob.sync(f).map(p => _.resolvePath(p)));
        });

        return style;
    }

}

export default function(options) {
    return new Task(options);
}