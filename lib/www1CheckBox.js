const CheckboxPrompt = require('inquirer/lib/prompts/checkbox')
const chalk = require('chalk')
var figures = require('figures')

module.exports = class extends CheckboxPrompt {
  render (error) {
    // Render question
    var message = this.getQuestion()
    var bottomContent = ''

    // Render choices or answer depending on the state
    if (this.status === 'answered') {
      message = ''
    } else {
      var choicesStr = renderChoices(this.opt.choices, this.pointer)
      var indexPosition = this.opt.choices.indexOf(
        this.opt.choices.getChoice(this.pointer)
      )
      message +=
        '\n' + this.paginator.paginate(choicesStr, indexPosition, this.opt.pageSize)
    }

    if (error) {
      bottomContent = chalk.red('>> ') + error
    }

    this.screen.render(message, bottomContent)
  }
}

/**
 * Function for rendering checkbox choices
 * @param  {Number} pointer Position of the pointer
 * @return {String}         Rendered content
 */

function renderChoices (choices, pointer) {
  var output = ''
  var separatorOffset = 0

  choices.forEach(function (choice, i) {
    if (choice.type === 'separator') {
      separatorOffset++
      output += ' ' + choice + '\n'
      return
    }

    if (choice.disabled) {
      separatorOffset++
      output += ' - ' + choice.name
      output += ' (' + (typeof choice.disabled === 'string' ? choice.disabled : 'Disabled') + ')'
    } else {
      var line = getCheckbox(choice.checked) + ' ' + choice.name
      if (i - separatorOffset === pointer) {
        output += chalk.cyan(figures.pointer + line)
      } else {
        output += ' ' + line
      }
    }

    output += '\n'
  })

  return output.replace(/\n$/, '')
}

/**
 * Get the checkbox
 * @param  {Boolean} checked - add a X or not to the checkbox
 * @return {String} Composited checkbox string
 */

function getCheckbox (checked) {
  return checked ? chalk.green(figures.radioOn) : figures.radioOff
}
