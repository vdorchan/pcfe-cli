const spawn = require('cross-spawn')

module.exports = function (installer = 'npm', cwd) {
  spawn.sync(installer, ['install'], { stdio: 'inherit', cwd })
  // spawn.sync('npm', ['install'], { stdio: 'inherit', cwd: 'zt' })
}
