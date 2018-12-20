const archiver = require('archiver')
const fs = require('fs')
const path = require('path')

module.exports = function (sourcePath, outputPath, baseFolder) {
  const output = fs.createWriteStream(outputPath)
  const archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level.
  })

  archive.pipe(output)

  Array.prototype.concat(sourcePath).forEach(f => {
    fs.statSync(f).isDirectory() && archive.directory(f, false)
    fs.statSync(f).isFile() && archive.file(f, { name: baseFolder ? f.replace() : path.basename(f) })
  })

  archive.finalize()
}
