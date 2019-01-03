const svnUltimate = require('node-svn-ultimate')
const { promisify: pify } = require('util')

const svn = {}
svn.url = 'svn://192.168.19.145'
svn.init = function (svnUser) {
  let {
    svnUsername,
    svnPassword,
    username,
    password,
    svnUrl
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

  this.svnUrl = svnUrl || 'svn://192.168.19.145'
}

svn.getUrl = function (url) {
  return `${this.url}/${url || ''}`
}

svn.checkUser = function (user) {
  this.init(user)
  return pify(svnUltimate.commands.info)(this.getUrl(), this.user)
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
