const spawn = require('cross-spawn')
const commandExists = require('command-exists')

const installers = ['yarn', 'npm']

module.exports = function (installer = 'npm') {
  installers.unshift(installer)

  installer = installers.filter(i => commandExists.sync(i))[0]

  if (installer) {
    spawn.sync(installer, ['install'], { stdio: 'inherit' })
  }
}
