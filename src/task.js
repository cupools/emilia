'use strict';

import fs from 'fs-extra';
import glob from 'glob';
import postcss from 'postcss';
import * as File from './file';
import * as sprite from './sprite';
import _ from './utils/util';

const urlReg = /(?:url\(['"]?([\w\W]+?)(?:\?(__)?([\w\W]+?))?['"]?\))/;
const declFilter = /(-webkit-)?background-(size|repeat)/;

class Task {
    constructor(options) {
        this.options = Object.assign({
            src: ['*.css'],
            dest: './',
            output: './components/images/',
            cssPath: '../../components/images/',
            prefix: 'sprite-',
            algorithm: 'binary-tree',
            padding: 10,
            sizeLimit: 5 * 1024
        }, options);

        this.storage = {
            spritesMap: {}
        };

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
        let sprites = this.storage.spritesMap;

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

                    let realpath = this._getImageRealpath(url, file.realpath);
                    sprites[tag].push(realpath);
                }
            }
        });
    }

    _initImage() {
        let spritesMap = this.storage.spritesMap;
        let keys = Object.keys(spritesMap);

        keys.map(tag => {
            let images = _.uniq(spritesMap[tag]);

            images.map(realpath => {
                this.initImage(realpath);
            });
        });
    }

    initImage(realpath) {
        return File.wrap({
            realpath,
            type: 'IMAGE',
            content: fs.readFileSync(realpath, 'binary')
        });
    }

    _buildSprite() {
        let spritesMap = this.storage.spritesMap;
        let keys = Object.keys(spritesMap);
        let opt = this.options;

        keys.map(tag => {
            let ret = sprite.processSprite({
                tag,
                sprites: spritesMap[tag],
                options: opt
            });

            let path = _.joinPath(opt.output, tag + '.png');
            let content = new Buffer(ret.image);

            File.wrap({
                path,
                content,
                id: tag,
                type: 'SPRITE',
                meta: {
                    width: ret.properties.width,
                    height: ret.properties.height,
                    coordinates: ret.coordinates
                }
            });
        });
    }

    _outputStyle() {
        let processor = postcss();
        let styles = File.getStyles();
        let keys = Object.keys(styles);

        keys.map(p => {
            let file = styles[p];
            processor.use(this._updateDecls.bind(this, file));

            let css = processor.process(file.content).css;
            file.content = css;

            this.outputStyle(file);
        });
    }

    _updateDecls(file, css) {
        let opt = this.options;

        css.walkDecls(decl => {
            if(decl.prop.indexOf('background') !== -1 && decl.value.indexOf('?__') !== -1) {
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
                        value: `${-chip.x}px ${-chip.y}px`
                    });
                    let size = postcss.decl({
                        prop: 'background-size',
                        value: `${meta.width}px ${meta.height}px`
                    });

                    url = sprite.url || `${opt.cssPath}${tag}.png`;
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

    _outputImage() {
        let sprites = File.getSprites();
        let keys = Object.keys(sprites);

        keys.map(tag => {
            this.outputImage(sprites[tag]);
        });
    }

    outputStyle(file) {
        console.log(file.content);
    }

    outputImage(file) {

    }

    /**
     * Get Image realpath in stylesheet by url
     * It can be rewrite in need
     */
    _getImageRealpath(url, stylePath) {
        return _.joinPath(stylePath, '../' ,url);
    }

    /**
     * get stylesheet realpath by node-glob
     */
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