# ChangeLog

## 0.1.3

* perf: 使用 [gulp-terser](https://www.npmjs.com/package/gulp-terser) 代替 [gulp-uglify](https://www.npmjs.com/package/gulp-uglify)，支持构建 ES6

## 0.1.2

* feat: 构建流程会生成md5戳，并添加到静态资源文件名，以控制缓存
* perf: 使用 imagemin 插件压缩图片时增加jpg、gif、svg等插件使用

## 0.1.1

* fix: 用户配置 set 报错

## 0.1.0

* feat: 增加 imagemin 命令用来进行图片压缩

## 0.0.6

* perf: 优化相关提示语句

## 0.0.5

* fix: 引入了本地路径的www1模块

## 0.0.2

* 通过拉取线上（svn）模板创建项目
* 存储用户信息，
* 本地预览，支持热更新
* 构建生产环境可用的包
* 方便强大的 www1 上传方式
* CSS压缩
* JS压缩
* 图片压缩