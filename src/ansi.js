const getPixels = require("get-pixels")

class Pixel {
  constructor(r, g, b, a) {
    this.red = r;
    this.green = g;
    this.blue = b;
    this.alpha = a;
  }

  static loadFromArray(array, index, channels) {
    let a = channels === 4 ? array[index+3] / 255 : 1
    return new Pixel(array[index], array[index+1], array[index+2], a)
  }

  static loadFromHexadecimal(hex) {
    if (!hex) {
      return null
    }
    const r = parseInt('0x' + hex.slice(1, 3))
    const g = parseInt('0x' + hex.slice(3, 5))
    const b = parseInt('0x' + hex.slice(5, 7))
    return new Pixel(r, g, b, 1)
  }

  setBackground(bg) {
    if (!bg) {
      return this
    }

    const alpha = 1 - (1 - this.alpha) * (1 - bg.alpha);
    this.red = Math.round(this.red * this.alpha / alpha + bg.red * bg.alpha * (1 - this.alpha) / alpha)
    this.green = Math.round(this.green * this.alpha / alpha + bg.green * bg.alpha * (1 - this.alpha) / alpha)
    this.blue = Math.round(this.blue * this.alpha / alpha + bg.blue * bg.alpha * (1 - this.alpha) / alpha)
    this.alpha = alpha
    return this
  }

  static toLowResAnsi(pixel) {
    return (pixel.alpha === 0)
      ? '\x1b[0m  '
      : '\x1b[48;2;'+pixel.red+';'+pixel.green+';'+pixel.blue+'m  '
  }

  static toHighResAnsi(pixelTop, pixelBottom) {
    if (pixelTop.alpha === 0) {
      return (pixelBottom.alpha === 0)
        ? '\x1b[0m '
        : '\x1b[38;2;' + pixelBottom.red + ';' + pixelBottom.green + ';' + pixelBottom.blue + 'm\u2584'
    } else {
      return (pixelBottom.alpha === 0)
        ? '\x1b[38;2;' + pixelTop.red + ';' + pixelTop.green + ';' + pixelTop.blue + 'm\u2580'
        : '\x1b[48;2;' + pixelTop.red + ';' + pixelTop.green + ';' + pixelTop.blue + 'm' +
          '\x1b[38;2;' + pixelBottom.red + ';' + pixelBottom.green + ';' + pixelBottom.blue + 'm\u2584'
    }
  }
}

function convertToAnsi(imgPath, background, resolution, callback) {
  getPixels(imgPath, function(err, pixels) {
    if (err) {
      console.log("Bad image path")
      return
    }
    const width = pixels.shape[0]
    const height = pixels.shape[1]
    const channels = pixels.shape[2]
    let art = []

    if (resolution === 'low') {
      for (let x = 0; x < pixels.data.length; x+=channels) {
        const pixel = Pixel.loadFromArray(pixels.data, x, channels)
        art.push(Pixel.toLowResAnsi(pixel))
        if (((x+channels)/channels) % width === 0) {
          art.push('\x1b[0m\n')
        }
      }
    } else {
      const bgPixel = Pixel.loadFromHexadecimal(background)
      for (let y = 0; y < height; y += 2) {
        for (let x = 0; x < width; x++) {
          const index = y * (width * channels) + x * channels;
          const top = Pixel.loadFromArray(pixels.data, index, channels).setBackground(bgPixel)
          const bottom = (y < height - 1)
            ? Pixel.loadFromArray(pixels.data, index + (width * channels), channels).setBackground(bgPixel)
            : new Pixel(0, 0, 0, 0)
          art.push(Pixel.toHighResAnsi(top, bottom))
        }
        art.push('\x1b[0m\n')
      }
    }

    callback(art.join(''))
  })
}

module.exports = convertToAnsi