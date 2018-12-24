const inquirer = require('inquirer')

exports.ask = async function (message, _default = true) {
  const name = 'aConfirmPrompt'
  return (await inquirer.prompt([{
    name,
    type: 'confirm',
    default: _default,
    message
  }]))[name]
}

exports.choose = async function (message, confirmMessage, _default = true) {
  const name = 'aConfirmPrompt'
  return (await inquirer.prompt([{
    name,
    type: 'list',
    default: _default,
    choices: [
      { name: confirmMessage || '确认', value: true, checked: _default },
      { name: '取消', value: false, checked: !_default }
    ],
    message
  }]))[name]
}
