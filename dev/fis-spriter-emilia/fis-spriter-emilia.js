'use strict';

let Emilia = require('../../main');

module.exports = function(ret, conf, settings, opt) {

    let src = [];

    fis.util.map(ret.src, function(subpath, file) {
        if (file.isCssLike) {
            src.push(file.subpath);
        }
    });

    src = src.map(f => '.' + f);

    let sp = new Emilia({
        src: src
    });

    sp.initStyle = function(realpath) {
        let File = sp.File;
        let node = getSrc(ret, realpath);

        return File.wrap({
            node,
            realpath,
            type: 'STYLE',
            content: node.getContent(),
        });
    };

    sp.initImage = function(realpath) {
        let File = sp.File;
        let node = getSrc(ret, realpath);

        return File.wrap({
            node,
            realpath,
            type: 'IMAGE',
            content: node.getContent()
        });
    };

    sp._getImageRealpath = function(url) {
        return getSrc(ret, url, 'url').realpath;
    };

    sp.outputStyle = function(file) {
        file.node.setContent(file.content);
    }

    sp.outputImage = function(file) {
        let image = fis.file.wrap(require('path').resolve(process.cwd(), file.path));
        image.setContent(file.content);
        fis.compile(image);
        ret.pkg[file.path] = image;

        file.url = image.url;
    }

    sp.run();

};


function getSrc(ret, val, field) {
    let src = ret.src;
    let keys = Object.keys(src);
    let image = null;

    field = field || 'realpath';

    keys.map(key => {
        let f = src[key];
        if(f[field] === val) {
            image = f;
        }
    });

    return image;
}