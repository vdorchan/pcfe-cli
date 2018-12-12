const chalk = require('chalk')
const ora = require('ora')

exports.fail = exports.error = async (msg, tag = null) => {
  ora().fail(chalk.red(msg))
  if (msg instanceof Error) {
    console.error(msg.stack)
  }
}

exports.warn = async (msg, tag = null) => {
  ora().warn(chalk.red(msg))
  if (msg instanceof Error) {
    console.error(msg.stack)
  }
}
