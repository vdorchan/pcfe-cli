const chalk = require('chalk')
const ora = require('ora')
const timestamp = require('time-stamp')

exports.fail = exports.error = async (msg, tag = null) => {
  ora().fail(chalk.red(msg))
  if (msg instanceof Error) {
    console.error(msg.stack)
  }
}

exports.warn = async (msg, tag = null) => {
  ora().warn(chalk.yellow(msg))
  if (msg instanceof Error) {
    console.error(msg.stack)
  }
}

exports.info = async (msg, tag = null) => {
  ora().info(chalk.blue(msg))
}

exports.succeed = async (msg, tag = null) => {
  ora().succeed(msg)
}

exports.timeLog = msg => console.log(`[${chalk.gray(timestamp('HH:mm:ss'))}] ${msg}`)
