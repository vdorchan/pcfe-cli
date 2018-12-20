const svnUltimate = require('node-svn-ultimate')
const { promisify: pify } = require('util')

const {
  export: _export,
  list,
  cat
} = svnUltimate.commands

module.exports = class Svn {
  constructor (svnUser) {
    let {
      svnUsername,
      svnPassword,
      username,
      password,
      svnUrl
    } = svnUser

    this.svnUser = {
      username,
      password
    }

    if (svnUsername && svnPassword) {
      this.svnUser = {
        username: svnUsername,
        password: svnPassword
      }
    }

    this.svnUrl = svnUrl || 'svn://192.168.19.143'
  }

  async export (src, dst, options) {
    return pify(_export)(src, dst, Object.assign({}, this.svnUser, options))
  }

  async list (targets, options) {
    return pify(list)(targets, Object.assign(this.svnUser, options))
  }

  async cat (targets, options) {
    return pify(cat)(targets, Object.assign(this.svnUser, options))
  }

  getSvnUrl (url) {
    return `${this.svnUrl}/${url || ''}`
  }
}
