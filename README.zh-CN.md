## Emilia

Sprite 工具，支持 `rem`，支持输出多套精灵图片。

`Emilia` 通过分析样式文件并识别其中的标记，如 `url(a.png?__sprite)`，最终输出更新的样式文件和精灵图片。支持 `rem` 和 `px`，包括数值转换。此外，这个模块被设计得更加容易适应不同的框架，如 FIS3 或 Webpack。

如果你倾向于基于图片资源创建精灵图片，也许你会喜欢 [Lia](https://github.com/cupools/lia)。

## 使用
```bash
npm install --save-dev emilia
```

在模块中使用：

```js
var Emilia = require('emilia');
var emilia = new Emilia({
    src: ['src/css/*.css'],
    dest: 'build/css/',
    output: 'build/images/',
    cssPath: '../images/',
    unit: 'rem',
    convert: 16
});

emilia.run();
```

在 CLI 中使用：

```bash
$ emilia help

  Usage: emilia [options] [command]

  Commands:

    help                   Output usage information

  Options:

    -s, --src <src>        stylesheet path, use glob patterns
    -d, --dest <dir>       output compiled stylesheet file to <dir>
    -o, --output <dir>     output sprite pictures to <dir>
    --cssPath              image url path
    --prefix               prefix basename of sprite picture
    --algorithm            layout algorithm of sprite pictures
    --padding              padding between images
    --convert              numerical scale
    --unit                 unit of backgound-size and position
    --quiet                disabled output info in the console
```

功能如下所示：

```css
/*    原始样式文件    */
.icon0 {
  background: #ccc url(../images/0.png?__icon) no-repeat;
  background-size: 128px 128px;
}
.icon2 {
  background: url(../images/2.png?__icon) no-repeat;
  background-size: 50px 50px;
}

/*    输出样式文件    */
.icon0 {
  background: #ccc url(../images/sprite-icon.png) no-repeat;
  background-position: 0rem 0rem;
  background-size: 22.875rem 16rem;
}
.icon2 {
  color: #ccc;
  background: url(../images/sprite-icon.png) no-repeat;
  background-position: -16.625rem 0rem;
  background-size: 22.875rem 16rem;
}
```

![sprite-icon](docs/sprite-icon.png)

## 文档

### `new Emilia(options)`
创建一个 `Emilia` 实例

- options `Object` - 参数
    - src `Array`
        - 描述: 样式文件路径, 使用 [glob patterns](https://github.com/isaacs/node-glob)
        - 默认: ['**/\*.css']
    - dest `String`
        - 描述: 更新后的样式文件的输出路径
        - 默认: 'build/css/'
    - output `String` 
        - 描述: 精灵图片的输出路径
        - 默认: 'build/images/'
    - cssPath `String` 
        - 描述: 精灵图片的 url
        - 默认: '../images/'
    - prefix `String` 
        - 描述: 输出精灵图片的文件名前缀
        - 默认: 'sprite-'
    - algorithm `String` 
        - 描述: 精灵图片的排序算法
        - 默认: 'binary-tree'
        - value: ['top-down' | 'left-right' | 'diagonal' | 'alt-diagonal' | 'binary-tree']
    - padding `Number` 
        - 描述: 图片间距
        - 默认: 10
    - convert `Number` 
        - 描述: 数值转换
        - 默认: 1
    - unit `String` 
        - 描述: 数值单位
        - 默认: 'px'
    - quiet `Boolean` 
        - 描述: 不在控制台输出信息
        - 默认: false    

### `emilia.run()`
开始编译流程，包括 `emilia.collect` 和 `emilia.process`。

### `emilia.collect()`
获取样式文件并将其封装为简单的 `file` 对象，为下一步编译做准备

### `emilia.process()`
分析样式文件并识别精灵图标识、合并精灵图片并得到坐标信息、最后输出精灵图片和更新之后的样式文件

## 示例
### 处理单个样式文件

```js
emilia = new Emilia({
    src: ['test/fixtures/css/main.css'],
    dest: 'test/tmp/',
    output: 'test/tmp/images/',
    cssPath: './images/'
});
emilia.run();
```

```css
/* test/fixtures/css/main.css */
.icon4 {
  background: url(../images/4.png?__tom) no-repeat;
}
.icon5 {
  background: url(../images/5.png?__jerry) no-repeat;
}
.icon6 {
  background: url(../images/6.png?__jerry) no-repeat;
}
.icon7 {
  background: url(../images/7.png?__inline) no-repeat;
}
```

### 处理多个样式文件

```js
emilia = new Emilia({
    src: ['test/fixtures/css/multi_*.css'],
    dest: 'test/tmp/',
    output: 'test/tmp/'
}); 
emilia.run();
```

### 使用 `rem` 单位

```js
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
```

### 内联图片

```css
.icon {
    background: url(../images/icon?__inline);
}
```

### 在 CLI 中使用

```bash
$ emilia -s fixtures/css/main.css,fixtures/css/multi_*.css
[warn]: ../images/undefined.png not exists
[warn]: ../images/undefined.png not exists
[info]: Created build/images/sprite-tom.png
[info]: Created build/images/sprite-jerry.png
[info]: Created build/css/main.css
[info]: Created build/css/multi_one.css
[info]: Created build/css/multi_two.css
```

## 测试
```bash
$ npm run test
```

## License

Copyright (c) 2016 cupools

Licensed under the MIT license.