const { chunk } = require('./utils')

class Text {
  constructor (str) {
    this.str = str
    this.bg = null
    this.fg = null
  }

  static space (count) {
    return new Text(' '.repeat(count || 1))
  }

  static bottomHalf (count) {
    return new Text('\u2584'.repeat(count || 1))
  }

  static topHalf (count) {
    return new Text('\u2580'.repeat(count || 1))
  }

  static newLine (count) {
    return new Text('\n'.repeat(count || 1))
  }

  withForeground (pixel) {
    this.fg = pixel
    return this
  }

  withBackground (pixel) {
    this.bg = pixel
    return this
  }

  ansi () {
    if ((!this.bg || this.bg.alpha === 0) && (!this.fg || this.fg.alpha === 0)) {
      return '\x1b[0m' + this.str
    }

    let text = ''
    if (this.bg && this.bg.alpha !== 0) {
      text += '\x1b[48;2;' + this.bg.red + ';' + this.bg.green + ';' + this.bg.blue + 'm'
    }
    if (this.fg) {
      text += '\x1b[38;2;' + this.fg.red + ';' + this.fg.green + ';' + this.fg.blue + 'm'
    }
    return text + this.str
  }
}

class Render {
  static atLowRes (pixel) {
    return Text.space(2).withBackground(pixel).ansi()
  }

  static atHighRes (pixelTop, pixelBottom) {
    if (pixelTop.alpha === 0 && pixelBottom.alpha === 0) {
      return Text.space().ansi()
    } else if (pixelBottom.alpha === 0) {
      return Text.topHalf().withForeground(pixelTop).ansi()
    } else {
      return Text.bottomHalf().withBackground(pixelTop).withForeground(pixelBottom).ansi()
    }
  }
}

class Pixel {
  constructor (r, g, b, a) {
    this.red = r
    this.green = g
    this.blue = b
    this.alpha = a
  }

  static fromArray (rgba, background) {
    const a = rgba.length === 4 ? rgba[3] / 255 : 1
    return new Pixel(rgba[0], rgba[1], rgba[2], a).forBackground(background)
  }

  static fromHexadecimal (hex) {
    if (!hex || !hex.startsWith('#') || hex.length !== 7) {
      return null
    }
    const r = parseInt('0x' + hex.slice(1, 3))
    const g = parseInt('0x' + hex.slice(3, 5))
    const b = parseInt('0x' + hex.slice(5, 7))
    return new Pixel(r, g, b, 1)
  }

  forBackground (bg) {
    if (!bg) {
      return this
    }
    const alpha = 1 - (1 - this.alpha) * (1 - bg.alpha)
    this.red = Math.round(this.red * this.alpha / alpha + bg.red * bg.alpha * (1 - this.alpha) / alpha)
    this.green = Math.round(this.green * this.alpha / alpha + bg.green * bg.alpha * (1 - this.alpha) / alpha)
    this.blue = Math.round(this.blue * this.alpha / alpha + bg.blue * bg.alpha * (1 - this.alpha) / alpha)
    this.alpha = alpha
    return this
  }
}

class Image {
  constructor (pixels, background) {
    this.bgPixel = Pixel.fromHexadecimal(background)
    this.width = pixels.shape[0]
    this.channels = pixels.shape[2]
    this.pixels = chunk(pixels.data, this.channels)
  }

  render (resolution) {
    const art = (resolution === 'low') ? this.lowResRendering() : this.highResRendering()
    return art.join('')
  }

  lowResRendering () {
    const art = []
    for (let index = 0; index < this.pixels.length; index += 1) {
      const pixel = Pixel.fromArray(this.pixels[index], this.bgPixel)
      art.push(Render.atLowRes(pixel))
      if ((index + 1) % this.width === 0) {
        art.push(Text.newLine().ansi())
      }
    }
    return art
  }

  highResRendering () {
    const art = []
    const skipOddLine = (index, width) => this.width * (Math.ceil((index + width + 2) / width) % 2)
    for (let index = 0; index < this.pixels.length; index += 1 + skipOddLine(index, this.width)) {
      const top = this.getPixel(index)
      const bottom = this.getPixel(index + this.width, new Pixel(0, 0, 0, 0))
      art.push(Render.atHighRes(top, bottom))
      if ((index + 1) % this.width === 0) {
        art.push(Text.newLine().ansi())
      }
    }
    return art
  }

  getPixel (index, defaultValue = null) {
    return (index >= 0 && index < this.pixels.length) ? Pixel.fromArray(this.pixels[index], this.bgPixel) : defaultValue
  }
}

const convertToAnsi = (pixels, background, resolution) => {
  return new Image(pixels, background).render(resolution)
}

module.exports = convertToAnsi
