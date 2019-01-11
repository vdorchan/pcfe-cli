# pcfe-cli

> pcfe-cli 旨在帮助人们快速创建项目，通过预设的模板和交互，生成项目相应的目录和代码。
>
> 同时还具备开发环境和项目上线的功能。

[npm-url]: https://www.npmjs.com/package/pcfe-cli
[npm-image]: https://img.shields.io/npm/v/pcfe-cli.svg
[node-url]: https://nodejs.org/en/download/
[node-image]: https://img.shields.io/node/v/pcfe-cli.svg

[![NPM version][npm-image]][npm-url]
[![NODE version][node-image]][node-url]

## 目录

* [安装](#安装)
* [创建一个项目](#创建一个项目)
* [用户信息](#用户信息)
* [项目配置文件](#项目配置文件)
* [启动一个开发服务器](#启动一个开发服务器)
* [构建一个用于上线的包](#构建一个用于上线的包)
* [上传项目](#上传项目)
* [离线模式](#离线模式)
* [zt-gulp模板的使用](#zt-gulp模板的使用)

## [功能一览](#功能一览)

### 创建项目

- [x] 通过拉取线上（svn）模板创建项目

### 项目编译

- [x] 可以启动一个开发服务器，支持热更新
- [x] 构建生产环境可用的包

### 项目上线

- [x] 方便强大的 www1 上传方式

## [安装](#安装)

该工具基于node，并且异步控制方式使用了 async，所以请确保已具备较新的node环境（![NODE version][node-image]）

工具内 svn 的相关操作需要借助于 svn 的命令行工具，mac自带，windows 则需要先安装 svn 命令行工具。

windows 用户在以下页面内下载安装

[https://sourceforge.net/projects/win32svn/](https://sourceforge.net/projects/win32svn/)

然后将软件目录下的 bin 目录，加入环境变量

使用 npm 或 cnpm 或 yarn 全局安装

```bash
npm install -g pcfe-cli
# 或
cnpm install -g pcfe-cli
# 或
yarn global add pcfe-cli
```

安装之后，你就可以在命令行中访问 `pcfe` 命令。你可以通过简单运行 `pcfe`，看看是否展示出了一份所有可用命令的帮助信息，来验证它是否安装成功。

你还可以用这个命令来检查其版本是否正确：

```bash
pcfe --version
# 或
pcfe -v
```

## [创建一个项目](#创建一个项目)

### pcfe create

运行以下命令来创建一个新项目：

```bash
pcfe create 190101-bmw
```

然后你会被提示选取一个专题模板，选择合适的模板然后继续进行操作
![pcfe create](https://www1.pconline.com.cn/test/pcfeCli/images/pcfe-create.png?)
选择完相应的模板之后，通过交互式完成一些设定。
![pcfe create](https://www1.pconline.com.cn/test/pcfeCli/images/pcfe-create2.png?)

或者你可以直接指定你要用的模板，下列命令将使用 `zt-gulp` 创建 `190101-bmw` 项目

```bash
pcfe create 190101-bmw zt
```

`pcfe create` 的一些用法可以通过以下命令查看

```bash
pcfe create --help
```

```bash
用法: create [options] <projectName> [templateName]

通过拉取模板创建项目

选项:
  --offline   使用离线模板
  -f --force  覆盖已存在的项目目录
```

## [用户信息](#用户信息)

### 首次使用

为了方便开发，以及上传需要用户信息。所以在第一次使用的时候会询问 svn 信息。

![pcfe create](https://www1.pconline.com.cn/test/pcfeCli/images/pcfe-create3.png?)
在完善用户账号的时候会进行验证。
![pcfe create](https://www1.pconline.com.cn/test/pcfeCli/images/pcfe-create4.png?)
用户信息的配置文件将保存在用户目录下的 `.pcuserconf` 文件中。

### pcfe user

在首次完善用户信息之后，后续想要对用户信息进行操作时可使用 `pcfe user`。

修改用户名

```bash
pcfe user --set username lisi
```

使用 `pcfe user --help` 查看更多帮助

```bash
用法: user [options]

选项:
  --set <key> <value>  设置用户配置中指定参数的指
  --get <key>          获取用户配置中指定参数的指
  -d --delete <key>    删除用户配置中指定参数的指
  -l --list            展示用户配置
  --check              验证账号是否正确并保存至配置文件中
  --check-svn          验证 svn 账号是否正确并保存至配置文件中
  --reset              对用户配置进行重设
  --no-store           验证账号时不保存配置文件
```

## [项目配置文件](#项目配置文件)

`pc.config.js` 是一个可选的配置文件。当该文件存在的时候，执行`pcfe` 命令的时候会自动读取。

这个文件应该导出一个包含了选项的对象：

```javascript
// pc.config.js
module.exports = {
  // 选项...
}
```

## [启动一个开发服务器](#启动一个开发服务器)

### pcfe serve

在开发时，可使用以下命令启动一个服务器（基于[browser-sync](https://github.com/BrowserSync/browser-sync)），支持热更新。

```bash
pcfe serve
```

服务器默认监听文件夹为当前目录，你也可以监听其它文件夹

监听当前 `src` 文件夹

```bash
pcfe serve src
```

如果在项目配置文件中配置了开发目录，在该项目目录下启动，将会自动监听开发目录

```javascript
module.exports = {
  // 选项...
  paths: {
    src: 'src' // 开发目录
  }
}
```

使用 `pcfe serve --help` 查看更多帮助

```bash
用法: serve [options] [baseDir]

启动一个开发服务器

Options:
  --open      在服务器启动时打开浏览器
  -p --port   指定要使用的端口(默认值：9000)
  --host      指定 host (默认值：0.0.0.0)
  --https     使用 https (默认值：false)
```

## [构建一个用于上线的包](#构建一个用于上线的包)

### pcfe build

使用以下命令，会将开发目录（默认 `src`）下的文件进行 js/css/图片压缩，然后输出到 `dist/` 目录。

```bash
pcfe build
```

可以在项目配置文件中配置了开发目录和生产目录

```javascript
// pc.config.js
module.exports = {
  paths: {
    src: 'src', // 开发目录
    dist: 'dist' // 生产目录
  }
  // ...
}
```

## [上传项目](#上传项目)

### pcfe www1

使用以下命令，将目录下的文件上传。

```bash
pcfe www1
```

在项目开发时，应配合使用配置文件。

```javascript
// pc.config.js
module.exports = {
  www1: {
    cwd: 'dist', // 上传文件的工作目录
    targetPath: 'zt/gz20190101/bmw/', // 路径格式： zt/gz20190101/bmw/
    site: 'pcauto',
    ignore: [''] // 忽略上传的文件列表
  }
  // ...
}
```

上传文件时，交互式操作方便，你可以选择性上传文件
![pcfe www1](https://www1.pconline.com.cn/test/pcfeCli/images/pcfe-www1.png?)

### 其它使用方式

上传指定文件夹

```bash
# 上传 js 和 css 文件夹
pcfe www1 js css
```

路径使用绝对路径

```bash
# 上传 js 和 css 文件夹
pcfe www1 ~/Documents/www/190110/js ~/Documents/www/style.css
```

```bash
用法: www1 [options] [file...]

上传到www1服务器

选项:
  --ignore-config  忽略配置文件
  --ignore-cwd     忽略配置文件中设置的当前工作路径
  --ignore-dir     忽略文件夹路径关系，所有文件将在同一路径下
```

### 模板

### pcfe list

使用以下命令可以查看可用的模板列表

```bash
pcfe list
```

使用 `pcfe list --help` 查看更多帮助

```bash
用法: list [options]

列出模板

选项:
  --offline    查看离线模板列表
  -u --update  查看模板，并更新离线模板
```

## [离线模式](#离线模式)

模板列表和文件将从 svn 上拉取，拉取之后会保存到本地，无网络时可使用离线模式

使用离线模式，加上 `--offline` 选项即可

使用离线模式创建项目

```bash
pcfe create 190101-bmw --offline
```

使用离线模式查看模板列表

```bash
pcfe list --offline
```

## [zt-gulp模板的使用](#zt-gulp模板的使用)

这个模板将创建以 `gulp` 作为构建工具的脚手架，在使用 `gulp` 做构建处理的时候，需要安装很多项目依赖，占用时间会比较多。

于是这个模板在设计的时候，允许用户创建一个总目录用于存放依赖，各个项目将放置于这个目录之下。

这些项目可以不用单独安装依赖，根据 npm 的特性，它会向上寻找依赖，然后在总目录找到依赖。

首先创建一个 `pcgroup` 总目录

```bash
# `pcgroup` 为目录名，`zt-gulp` 为模板名，`init` 作为选项参数将会传给 `zt-gulp`，模板拿到这个参数，便知道你是在创建总目录
pcfe create pcgroup zt-gulp --init
```

你可以选择马上安装依赖，也可以取消，稍后再使用 `npm install` 或 `cnpm install` 安装
![zt gulp](https://www1.pconline.com.cn/test/pcfeCli/images/zt-gulp.png?)
到这里，总目录创建完成，并完成安装依赖。
![zt gulp](https://www1.pconline.com.cn/test/pcfeCli/images/zt-gulp2.png?)

接着根据提示操作

```bash
# 进入 pcgroup/zt 目录
cd pcgroup/zt

# 创建 190101-bmw 项目
pcfe create 190101-bmw zt-gulp
```

进入到这里项目就创建完毕了，按照提示进行开发即可。
![pcfe www1](https://www1.pconline.com.cn/test/pcfeCli/images/zt-gulp3.png?)
注意，这些项目单独拿到其它地方，使用 `npm install` 也是可以正常运行的。