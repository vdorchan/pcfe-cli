const fs = require('fs')
const memFs = require('mem-fs')
const editor = require('mem-fs-editor')
const path = require('path')
const mkdirp = require('mkdirp')
const inquirer = require('inquirer')

class Generator {
  constructor (projectName, template) {
    this.sharedFs = memFs.create()
    this.fs = editor.create(this.sharedFs)
    this.template = template
    this.projectName = projectName
  }

  async generate () {
    return new Promise((resolve, reject) => {
      const { projectName } = this
      try {
        fs.accessSync(this.destinationPath())
        reject(new Error(`${projectName}目录已存在`))
      } catch (error) {
        this.mkdir(projectName)
        resolve()
      }
    })
  }

  copyTpl (from, to, ...args) {
    this.fs.copyTpl(
      this.templatePath(from),
      this.destinationPath(to),
      ...args
    )
  }

  mkdir () {
    mkdirp.sync.apply(mkdirp, arguments)
  }

  templatePath (src) {
    return path.join(this.template, src)
  }

  destinationPath (src = '') {
    return path.join(process.cwd(), this.projectName, src)
  }
}

module.exports = async function (projectName, template) {
  const api = new Generator(projectName, template)

  try {
    await api.generate()
  } catch (error) {
    return console.log(error)
  }

  const prompts = require(api.templatePath('prompts.js'))
  const answers = await inquirer.prompt(prompts)

  const generate = require(api.templatePath('generate.js'))
  generate(api, answers)

  api.fs.commit(() => {
    console.log('任务成功')
  })
}
