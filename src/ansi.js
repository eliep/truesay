const fs = require('fs')
const getPixels = require("get-pixels")

function readAnsiFile(ansiPath, callback) {
  if (ansiPath) {
    if (!fs.existsSync(ansiPath)) {
      return `Ansi art file not found: ${ansiPath}`
    }
    fs.readFile(ansiPath, 'utf8', (err, art) => {
      if (err) throw err;
      callback(art);
    });
  }
}

function convertToAnsi(imgPath, callback) {
  getPixels(imgPath, function(err, pixels) {
    if(err) {
      console.log("Bad image path")
      return
    }
    const width = pixels.shape[0]
    const nbColors = pixels.shape[2]
    let art = []
    let lineHasColor = false
    for (let x = 0; x < pixels.data.length; x+=nbColors) {
      let r = pixels.data[x]
      let g = pixels.data[x+1]
      let b = pixels.data[x+2]
      let gamma = nbColors === 4 ? pixels.data[x+3] : 255
      let pixel
      if (gamma === 0) {
        pixel = lineHasColor ? '\033[0m  ' : '  '
      } else {
        pixel = '\033[48;2;'+r+';'+g+';'+b+'m  '
        lineHasColor = true
      }
      art.push(pixel)
      if (((x+nbColors)/nbColors) % width === 0) {
        art.push('\033[0m\n')
        lineHasColor = false
      }
    }
    // art.pop()
    // art.push('\n')
    callback(art.join(''))
  })
}

module.exports = { readAnsiFile, convertToAnsi }