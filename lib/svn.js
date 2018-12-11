const svnUltimate = require('node-svn-ultimate')
const { promisify: pify } = require('util')

const {
  export: _export,
  list,
  cat
} = svnUltimate.commands

const svnUser = {
  username: 'vdorchan',
  password: '000123456'
}

exports.svnExport = async function (src, dst, options) {
  return pify(_export)(src, dst, Object.assign({}, svnUser, options))
}

exports.svnList = async function (targets, options) {
  return pify(list)(targets, Object.assign(svnUser, options))
}

exports.svnCat = async function (targets, options) {
  return pify(cat)(targets, Object.assign(svnUser, options))
}

exports.svnUrl = url => `http://67.230.176.233/svn/repo/${url||''}`
