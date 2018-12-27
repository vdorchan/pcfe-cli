const fs = require('fs')
const memFs = require('mem-fs')
const editor = require('mem-fs-editor')
const path = require('path')
const mkdirp = require('mkdirp')
const inquirer = require('inquirer')
const installDeps = require('./installDeps')
const Queue = require('grouped-queue')
const runAsync = require('run-async')
const chalk = require('chalk')

const queues = [
  'prompting',
  'initializing',
  'configuring',
  'default',
  'writing',
  'conflicts',
  'install',
  'end'
]
class Generator {
  constructor (projectName, template, user, opts) {
    this.runLoop = new Queue(queues)

    this.chalk = chalk

    this.sharedFs = memFs.create()
    this.fs = editor.create(this.sharedFs)
    this.template = template
    this.projectName = projectName
    this.user = user
    this.opts = opts

    this.filter = require('fuzzy').filter
  }

  async createProjectDir () {
    return new Promise((resolve, reject) => {
      const { projectName } = this
      try {
        fs.accessSync(projectName)
        reject(new Error(`${projectName}目录已存在`))
      } catch (error) {
        this.mkdir(projectName)
        process.chdir(projectName)
        resolve()
      }
    })
  }

  copyTpl (from, to, ...args) {
    this.fs.copyTpl(
      this.templatePath(from),
      to,
      ...args
    )
  }

  mkdir () {
    mkdirp.sync.apply(mkdirp, arguments)
  }

  templatePath (src = '') {
    return path.join(this.template, src)
  }

  destinationPath (src = '') {
    return path.join(process.cwd(), src)
  }

  installDependencies (opts) {
    if (!opts.skipInstall) {
      installDeps('npm')
    }
  }

  prompt (prompts) {
    inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'))
    return inquirer.prompt(prompts)
  }

  log () {
    return console.log(arguments)
  }

  commitFs () {
    return new Promise((resolve, reject) => {
      this.fs.commit(async () => {
        resolve()
      })
    })
  }

  run () {
    return new Promise((resolve, reject) => {
      const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(this))
      const isValidMethods = (method) => method.charAt(0) !== '_' && method !== 'constructor'

      const validMethods = methods.filter(isValidMethods)
      const self = this

      this.runLoop.once('end', () => {
        resolve()
      })

      validMethods.forEach((method) => {
        const taskFunc = this[method]
        let methodName = method

        if (!queues.includes(method)) {
          methodName = 'default'
        }

        this.runLoop.add(methodName, (next) => {
          runAsync(function () {
            return taskFunc.apply(self)
          })().then(async () => {
            if (methodName === 'writing') {
              await this.commitFs()
            }
            next()
          })
        })
      })
    })
  }
}

module.exports = async function (projectName, template, user, opts) {
  const ProjectGenerator = require(template)(Generator)

  const project = new ProjectGenerator(projectName, template, user, opts)

  await project.createProjectDir()
  project.run()
}
