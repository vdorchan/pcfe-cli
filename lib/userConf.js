const inquirer = require('inquirer')
const path = require('path')
const fs = require('fs')
const homedir = require('os').homedir()
const { promisify: pify } = require('util')

const userConfFile = path.join(homedir, '.pcuserconf')

exports.getUser = () => {
  const user = {
    userConf: undefined,
    isComplete: false
  }
  const completeKeys = [
    'username',
    'password',
    'city',
    'svnUsername',
    'svnPassword'
  ]
  try {
    let userConf = fs.readFileSync(userConfFile, 'utf8')
    userConf = JSON.parse(userConf)

    user.userConf = userConf
    user.isComplete = completeKeys.every(k => typeof userConf[k] === 'string')
  } catch (error) {
  }

  return user
}

exports.generateUserConf = async () => {
  const { userConf } = exports.getUser()

  const answsers = await inquirer.prompt([{
    type: 'input',
    name: 'username',
    message: '请输入账号',
    default: userConf.username,
    validate: ipt => !!ipt.length || '账号不能为空'
  }, {
    type: 'password',
    name: 'password',
    message: '请输入密码',
    mask: '*',
    validate: ipt => !!ipt.length || '密码不能为空'
  }, {
    type: 'input',
    name: 'city',
    message: '所在城市（拼音首字母简写）',
    default: userConf.ctiy || 'gz'
  }, {
    type: 'input',
    name: 'svnUsername',
    message: '请输入 svn 账号',
    default: userConf.svnUsername
  }, {
    type: 'password',
    name: 'svnPassword',
    message: '请输入 svn 密码',
    mask: '*'
  }])

  return pify(fs.writeFile)(userConfFile, JSON.stringify(Object.assign(userConf, answsers), null, 2))
}
