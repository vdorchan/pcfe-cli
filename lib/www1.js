const fs = require('fs')
const path = require('path')
const www1 = require('pc-www1')
const chalk = require('chalk')
const { choose } = require('./confirm')
const { fail, info } = require('./logger')
const inquirer = require('inquirer')
const zip = require('./zip')

module.exports = async function (file, user, needZip) {
  let pcConfig = {}
  let www1Config = {}
  try {
    pcConfig = require(path.join(process.cwd(), 'pc.config.js'))
    www1Config = pcConfig.www1
  } catch (error) {
  }
  file = file || www1Config.file

  if (!file) {
    fail('请输入要上传的文件路径！')
    process.exit(1)
  }
  file = Array.prototype.concat(file).map(f => path.join(process.cwd(), f))

  if (file.length === 1) {
    const _file = file[0]
    const stats = fs.statSync(_file)
    if (stats.isDirectory()) {
      file = fs.readdirSync(_file).map(p => path.join(_file, p))
    }
  }

  console.log('needZip', needZip);
  if (needZip) {
    const zipDir = path.join(process.cwd(), 'zip')
    const _file = path.join(zipDir, `${pcConfig.projectName || 'zip'}.zip`)
    try {
      fs.accessSync(zipDir)
    } catch (error) {
      fs.mkdirSync(zipDir)
    }
    try {
      zip(file, _file)
      info(`成功打包文件：${_file}`)
    } catch (error) {
      fail(error)
      process.exit(1)
    }
    file = [_file]
  }

  const siteList = ['pcauto', 'pconline', 'pclady', 'pchouse', 'pcbaby']
  const site = www1Config.site || (await inquirer.prompt({ type: 'list', name: 'site', message: '上传网站？', choices: siteList })).site
  const targetPath = www1Config.targetPath || (await inquirer.prompt({ name: 'targetPath', message: '上传路径？' })).targetPath

  const msg = `${user.username}, 你将上传文件到 www1 服务器
待上传文件：
${chalk.blue(file.length > 1 ? file.join('\n') : file[0])}
上传地址：
${chalk.green(`www1.${site}.com.cn/${targetPath.replace(/([^/]$)/, '$1/')}`)}
是否确认操作`

  const upload = await choose(msg, false)

  if (!upload) {
    fail('已取消！')
    process.exit(1)
  }

  www1.init({ site })

  const session = await www1.verifyUser(user)

  await www1.upload(file, { targetPath }, session)
}
