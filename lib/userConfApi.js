const inquirer = require('inquirer')
const path = require('path')
const fs = require('fs')
const homedir = require('os').homedir()
const { promisify: pify } = require('util')
const { login } = require('/Users/vdorchan/Documents/www/npm/pc-www1/')
const { fail } = require('./logger')
const { checkUser } = require('./svn')
const ora = require('ora')

const USER_CONF = path.join(homedir, '.pcuserconf')

const userConfApi = module.exports
userConfApi.userConf = {}

const store = {
  userConf: {},
  isComplete: false
}

const completeKeys = [
  'username',
  'password',
  'city',
  'svnUsername',
  'svnPassword'
]

userConfApi.getUser = () => {
  try {
    let userConf = fs.readFileSync(USER_CONF, 'utf8')
    userConf = JSON.parse(userConf)

    store.userConf = userConf || {}
    store.isComplete = completeKeys.every(k => typeof userConf[k] === 'string')
  } catch (error) {
  }

  return store
}

userConfApi.askUser = async (errorChance = 3) => {
  const spiner = ora('验证账号密码是否正确...')
  this.getUser()
  const ask = async () => {
    try {
      const { username, password } = await inquirer.prompt([{
        type: 'input',
        name: 'username',
        message: '请输入账号',
        default: store.userConf.username,
        validate: ipt => !!ipt.length || '账号不能为空'
      }, {
        type: 'password',
        name: 'password',
        message: '请输入密码',
        mask: '*',
        validate: ipt => !!ipt.length || '密码不能为空'
      }])

      spiner.start()

      await login({ username, password, site: 'pconline' })
      Object.assign(store.userConf, { username, password })

      spiner.succeed('用户验证成功')
    } catch (error) {
      spiner.stop()

      if (--errorChance <= 0) {
        throw error
      }
      fail('账号密码验证错误，请检查后重新登陆！')
      console.log(error.message)
      await ask()
    }
  }

  await ask()
}

userConfApi.askCity = async () => {
  const { city } = await inquirer.prompt([{
    type: 'input',
    name: 'city',
    message: '所在城市（拼音首字母简写）',
    default: this.userConf.ctiy || 'gz'
  }])

  Object.assign(store.userConf, { city })
}

userConfApi.askSvnUser = async (errorChance = 3) => {
  const spiner = ora('验证 SVN 账号密码是否正确...')
  this.getUser()
  const ask = async () => {
    try {
      const { svnUsername, svnPassword } = await inquirer.prompt([{
        type: 'input',
        name: 'svnUsername',
        message: '请输入 svn 账号',
        default: store.userConf.svnUsername,
        validate: ipt => !!ipt.length || '账号不能为空'
      }, {
        type: 'password',
        name: 'svnPassword',
        message: '请输入 svn 密码',
        mask: '*',
        validate: ipt => !!ipt.length || '密码不能为空'
      }])

      spiner.start()

      await checkUser({ svnUsername, svnPassword })
      Object.assign(store.userConf, { svnUsername, svnPassword })

      spiner.succeed('SVN 用户验证成功')
    } catch (error) {
      spiner.stop()

      if (--errorChance <= 0) {
        throw error
      }
      fail('svn 账号密码验证错误，请检查后重新登陆！')
      console.log(error.message)
      await ask()
    }
  }

  await ask()
}

userConfApi.reset = async () => {
  await this.askUser()
  await this.askCity()
  await this.askSvnUser()

  return this.store()
}

userConfApi.set = async (key, value) => {
  if (!key || !value) {
    throw new Error('请提供键和值')
  }
  this.getUser()
  store.userConf[key] = value
  const spiner = ora().start()
  await this.store()
  spiner.succeed(`成功将 ${key} 设置为 ${value}`)
}

userConfApi.get = async (key) => {
  if (!key) {
    throw new Error('请提供值')
  }
  this.getUser()
  console.log(store.userConf[key])
}

userConfApi.check = async (store = true) => {
  await this.askUser()
  this.store()
}

userConfApi.checkSvn = async (store = true) => {
  await this.askSvnUser()
  store && this.store()
}

userConfApi.checkMissing = async () => {
  const { userConf: { username, password, svnUsername, svnPassword } } = this.getUser()

  if (!username || !password) await this.askUser()

  await this.askCity()

  if (!svnUsername || !svnPassword) await this.askSvnUser()

  await this.store()

  return store.userConf
}

userConfApi.store = () => {
  return pify(fs.writeFile)(USER_CONF, JSON.stringify(store.userConf, null, 2))
}
