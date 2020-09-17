const fs = require('fs')
const { resolve } = require('path')
const mime = require('./mime')

function assertImageFile (artPath) {
  let type
  try {
    if (!fs.existsSync(artPath) && !fs.existsSync(resolve(__dirname, '../art', artPath + '.png'))) {
      console.error(`Error: Art path ${artPath} does not exists`)
      process.exit(1)
    }
    if (!fs.existsSync(artPath)) {
      artPath = resolve(__dirname, '../art', artPath + '.png')
    }
    type = mime(artPath)
    if (!type) {
      console.error('Error: Image type must be either png, gif or jpeg')
      process.exit(1)
    }
    return artPath
  } catch (error) {
    console.error('Error: Unable to detect file type:\n', error.message)
    process.exit(1)
  }
}

module.exports = assertImageFile
