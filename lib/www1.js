const fs = require('fs')
const path = require('path')
const Www1 = require('pc-www1')
const ora = require('ora')
const chalk = require('chalk')
const recursive = require('recursive-readdir')
const { choose } = require('./confirm')
const { fail, info, succeed } = require('./logger')
const inquirer = require('inquirer')
const zip = require('./zip')
const { promisify: pify } = require('util')
const uploadIgnore = require('./uploadIgnore')

const PC_CONFIG = 'pc.config.js'

inquirer.registerPrompt('www1CheckBox', require('./www1CheckBox'))

async function formatFiles (files, ignore) {
  const _files = []
  for (let f of files) {
    if (fs.statSync(f).isDirectory()) {
      const files = await pify(recursive)(f, ignore)
      _files.push(...files)
    } else {
      _files.push(f)
    }
  }

  return _files
}

function getChoices (files) {
  const getChoiceObj = f => Array.prototype.concat(f).map(f => ({ value: f, checked: true }))
  const choices = []
  let separator = ''
  files.forEach(f => {
    const _separator = f.indexOf(path.sep) === -1 ? '' : f.split(path.sep)[0]
    if (_separator !== separator) {
      choices.push(new inquirer.Separator(`${_separator}文件夹`))
      separator = _separator
    }
    choices.push(...getChoiceObj(f))
  })
  return choices
}

module.exports = async function (files, user, projectDir, options) {
  const { ignoreDir, ignoreCwd, ignoreConfig } = options

  let pcConfig = {}
  let www1Config = {}

  try {
    pcConfig = require(path.resolve(process.cwd(), PC_CONFIG))
    www1Config = ignoreConfig ? {} : pcConfig.www1
  } catch (error) {
  }

  files = Array.prototype.concat(files || www1Config.file || '.')

  const isAbsolute = files.some(f => path.isAbsolute(f))

  let cwd = '.'
  if (!ignoreCwd && !isAbsolute && www1Config.cwd && www1Config.cwd !== '.') {
    cwd = www1Config.cwd
    process.chdir(cwd)
  }

  let message = `Hi ${user.username}\n`
  if (files.some(f => path.isAbsolute(f))) {
    message += '指定的文件路径包含绝对路径，将忽略文件夹路径关系，所有文件将在同一路径下'
  } else if (ignoreDir) {
    message += '当前模式下将忽略文件夹路径关系，所有文件将在同一路径下'
  } else {
    message += `你将上传${chalk.blue(cwd === '.' ? '当前' : ` ${cwd} `)}文件夹下的文件\n`
    message += chalk.gray(`当前路径: ${path.resolve(projectDir)}`)
  }

  console.clear()
  console.log(message)

  files = await formatFiles(files, uploadIgnore.concat(PC_CONFIG, www1Config.ignore || ''))

  let zipFile

  const choices = getChoices(files)
  files = (await inquirer.prompt([{
    type: 'www1CheckBox',
    name: 'files',
    message: `请选择需要上传的文件\n${chalk.gray('<space>选择 <enter>确认 <a>全选 <i>反选')}`,
    choices,
    pageSize: choices.length >= 10 ? 10 : choices.length
  }])).files

  if (isAbsolute) {
    www1Config = {}
  } else {
    zipFile = zip(files, path.join(projectDir, '.zip/zip.zip'))
  }

  info('以下文件将上传至 www1 服务器：')
  console.log((files.length > 1 ? files.join('\n') : files[0]) + '\n')

  const site = www1Config.site || (await inquirer.prompt({ type: 'list', name: 'site', message: '上传网站？', choices: Www1.siteList })).site
  const targetPath = www1Config.targetPath || (await inquirer.prompt({ name: 'targetPath', message: '上传路径？' })).targetPath

  console.log(`上传地址：${chalk.green(`www1.${site}.com.cn/${targetPath.replace(/([^/]$)/, '$1/')}`)}`)

  const upload = await choose('是否确认上传', '确认上传', false)

  if (!upload) {
    fail('已取消！')
    process.exit(1)
  }

  const www1 = new Www1(Object.assign({}, { site }, user))

  const spiner = ora('登录中...').start()

  try {
    await www1.login()

    spiner.text = '登陆成功，上传文件中...'
    const uploadedFiles = await www1.upload(zipFile || files, targetPath)
    spiner.stop()

    uploadedFiles.forEach(f => {
      succeed(`已上传：${f}`)
    })

    succeed('上传成功')
  } catch (error) {
    spiner.stop()
    fail(error)
  }

  try {
    fs.unlinkSync(zipFile)
  } catch (error) {
  }
}
