const svnUltimate = require('node-svn-ultimate')
const { promisify: pify } = require('util')
const commandExists = require('command-exists')

const svn = {}

const tplUrl = 'http://fesvn.pcauto.com.cn/svn/zt/tools/pc-templates'

svn.init = function (svnUser) {
  let {
    svnUsername,
    svnPassword,
    username,
    password,
    baseUrl
  } = svnUser

  this.user = {
    username,
    password
  }

  if (svnUsername && svnPassword) {
    this.user = {
      username: svnUsername,
      password: svnPassword
    }
  }

  this.baseUrl = baseUrl

  if (!this.isExists()) {
    throw new Error('svn 命令不存在，请先参考文档安装 svn 命令行工具')
  }
}

svn.getTplUrl = url => `${tplUrl}/${url || ''}`

svn.isExists = () => commandExists.sync('svn')

svn.checkUser = function (user) {
  this.init(Object.assign({}, user, { baseUrl: tplUrl }))
  return pify(svnUltimate.commands.info)(this.baseUrl, this.user)
}

const isObject = o => Object.prototype.toString.call({}) === Object.prototype.toString.call(o)

module.exports = new Proxy(svnUltimate.commands, {
  get (target, key, receiver) {
    if (typeof svn[key] === 'function') {
      return svn[key].bind(svn)
    }
    const fun = Reflect.get(target, key, receiver)
    if (!fun) {
      return
    }
    const { user } = svn
    return async function (...args) {
      let i = 0
      let hasOptions
      while (!hasOptions && i < args.length) {
        if (isObject(args[i])) {
          args[i] = Object.assign({}, user, args[i])
          hasOptions = true
        }
        i++
      }
      if (!hasOptions) {
        args.push(user)
      }
      return pify(fun).apply(this, args)
    }
  }
})
