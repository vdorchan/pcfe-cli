const spawn = require('cross-spawn')

module.exports = function (installer = 'npm') {
  spawn.sync(installer, ['install'], { stdio: 'inherit' })
}
