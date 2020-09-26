const fs = require('fs')
const { join, resolve } = require('path')

const chunk = (array, size) => {
  const chunked = []
  let index = 0
  while (index < array.length) {
    chunked.push(array.slice(index, size + index))
    index += size
  }
  return chunked
}

const startWith = (headers, buffer) => {
  for (const [index, header] of headers.entries()) {
    if (header !== buffer[index]) {
      return false
    }
  }
  return true
}

const mime = (path) => {
  const fd = fs.openSync(path, 'r')
  const buffer = Buffer.alloc(100)
  fs.readSync(fd, buffer, 0, 8, 0)
  let mime = null
  if (startWith([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A], buffer)) {
    mime = 'png'
  } else if (startWith([0xFF, 0xD8, 0xFF], buffer)) {
    mime = 'jpg'
  } else if (startWith([0x47, 0x49, 0x46], buffer)) {
    mime = 'gif'
  }
  return mime
}

const walkSync = (path) => {
  return fs.lstatSync(path).isDirectory()
    ? Array.prototype.concat(...fs.readdirSync(path).map(child => walkSync(join(path, child))))
    : path
}

const assertPath = (artPath) => {
  try {
    if (!fs.existsSync(artPath) &&
      !fs.existsSync(resolve(__dirname, '../art', artPath + '.png')) &&
      !fs.existsSync(resolve(__dirname, '../art', artPath))) {
      console.error(`Error: Art path ${artPath} does not exists`)
      process.exit(1)
    }
    if (!fs.existsSync(artPath)) {
      artPath = (fs.existsSync(resolve(__dirname, '../art', artPath + '.png')))
        ? resolve(__dirname, '../art', artPath + '.png')
        : resolve(__dirname, '../art', artPath)
    } else {
      artPath = resolve('.', artPath)
    }

    if (fs.lstatSync(artPath).isDirectory()) {
      const files = walkSync(artPath).filter(file => file.match(/(png|gif|jpg)$/))

      if (files.length === 0) {
        console.error(`Error: Art path ${artPath} does not contains any image files`)
        process.exit(1)
      }
      const file = files[Math.floor(Math.random() * Math.floor(files.length))]
      artPath = resolve(artPath, file)
    }

    const type = mime(artPath)
    if (!type) {
      console.error('Error: Image type must be either png, gif or jpeg')
      process.exit(1)
    }

    return artPath
  } catch (error) {
    console.error('Error: Unable to detect file type:\n', error)
    process.exit(1)
  }
}

module.exports = { chunk, mime, assertPath }
