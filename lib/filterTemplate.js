const templateReg = new RegExp(/^pcfe-\S+/)

module.exports = function (templateList) {
  return templateList.filter(template => {
    return typeof template === 'object'
      ? templateReg.test(template.value)
      : typeof template === 'string'
        ? templateReg.test(template)
        : ''
  }).map(template => {
    return typeof template === 'object'
      ? Object.assign(template, { name: template.name.replace(/pcfe-(.+)/, '$1') })
      : typeof template === 'string'
        ? template.replace('pcfe-', '')
        : ''
  })
}
