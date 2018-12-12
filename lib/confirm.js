const inquirer = require('inquirer')

module.exports = async function (message, _default = true) {
  const name = 'aConfirmPrompt'
  return (await inquirer.prompt([{
    name,
    type: 'confirm',
    default: _default,
    message
  }]))[name]
}
