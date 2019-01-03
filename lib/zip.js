const archiver = require('archiver')
const fs = require('fs')
const path = require('path')

module.exports = function (sourcePath, outputPath) {
  try {
    fs.mkdirSync(outputPath.replace(path.basename(outputPath), ''))
  } catch (error) {
  }

  const output = fs.createWriteStream(outputPath)
  const archive = archiver('zip', {
    zlib: { level: 9 }
  })

  archive.pipe(output)

  Array.prototype.concat(sourcePath).forEach(f => {
    fs.statSync(f).isDirectory() && archive.directory(f)
    fs.statSync(f).isFile() && archive.file(f)
  })

  archive.finalize()

  return outputPath
}
