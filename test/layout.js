const { describe, it } = require('mocha')
const expect = require('chai').expect
const layout = require('../src/layout')

const genArt = (width, height, char) => {
  const lines = []
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      lines.push(char)
    }
    lines.push('\n')
  }
  return lines.join('')
}

const genText = (length, char) => {
  return char.repeat(length)
}

const toTextWidth = (boxWidth) => boxWidth - 2 - 2
const toBoxWidth = (textWidth) => 2 + textWidth + 2
const toBoxHeight = (textHeight) => textHeight + 3

const parameters = [
  { artLength: 32, textLength: 5, paddingSize: 0, margin: { top: 0, left: 1, right: 1, bottom: 0 } },
  { artLength: 32, textLength: 2, paddingSize: 0, margin: { top: 0, left: 1, right: 1, bottom: 0 } },
  { artLength: 32, textLength: 30, paddingSize: 0, margin: { top: 0, left: 0, right: 0, bottom: 0 } },
  { artLength: 32, textLength: 30, paddingSize: 1, margin: { top: 1, left: 1, right: 1, bottom: 1 } },
  { artLength: 32, textLength: 30, paddingSize: 5, margin: { top: 1, left: 5, right: 5, bottom: 1 } },
  { artLength: 32, textLength: 50, paddingSize: 1, margin: { top: 1, left: 1, right: 1, bottom: 1 } }
]

describe('layout function', function () {
  it('should respect top layout specification', function () {
    for (const parameter of parameters) {
      const { artLength, textLength, paddingSize, margin } = parameter
      const maxWidth = 40
      const art = genArt(artLength, artLength, '\u2580')
      const text = genText(textLength, 'T')
      const position = 'top'
      const defaultSpikePosition = 10
      const boxOptions = { boxType: 'round' }
      const textLineLength = margin.left + toBoxWidth(textLength) + margin.right
      const fittedTextLineLength = Math.min(textLineLength, maxWidth) - margin.right
      const textHeight = toBoxHeight(Math.ceil(textLineLength / maxWidth))
      const boxWith = fittedTextLineLength - margin.left
      const spikePosition = Math.min(defaultSpikePosition, Math.floor(boxWith / 2))
      const output = layout({ art, text, position, paddingSize, margin, maxWidth, boxOptions })

      const lines = output.split('\n')
      expect(lines.length).to.equal(margin.top + textHeight + paddingSize + artLength + margin.bottom + 1)
      for (let i = margin.top; i < margin.top + textHeight - 1; i++) {
        expect(lines[i].length).to.equal(fittedTextLineLength)
      }
      expect(lines[margin.top + textHeight - 1].length).to.equal(margin.left + spikePosition + 1)
      for (let i = margin.top + textHeight + paddingSize; i < lines.length - margin.bottom - 1; i++) {
        expect(lines[i].length).to.equal(margin.left + artLength)
      }
      for (let i = lines.length - margin.bottom; i < lines.length; i++) {
        expect(lines[i].length).to.equal(0)
      }
    }
  })

  it('should respect right layout specification', function () {
    for (const parameter of parameters) {
      const { artLength, textLength, paddingSize, margin } = parameter
      const maxWidth = 40
      const art = genArt(artLength, artLength, '\u2580')
      const text = genText(textLength, 'T')
      const position = 'right'
      const boxOptions = { boxType: 'round' }
      const maxBoxWidth = maxWidth - artLength - paddingSize - margin.right - margin.left
      const boxWidth = Math.max(Math.min(toBoxWidth(textLength), maxBoxWidth), 5)
      const boxHeight = Math.ceil(textLength / (toTextWidth(boxWidth))) + 3
      const output = layout({ art, text, position, paddingSize, margin, maxWidth, boxOptions })
      const lines = output.split('\n')

      expect(lines.length).to.equal(margin.top + Math.max(boxHeight, artLength) + margin.bottom + 1)
      for (let i = margin.top; i < margin.top + boxHeight - 1; i++) {
        expect(lines[i].length).to.equal(margin.left + artLength + paddingSize + boxWidth)
      }
      for (let i = margin.top + boxHeight; i < lines.length - margin.bottom - 1; i++) {
        expect(lines[i].length).to.equal(margin.left + artLength)
      }
      for (let i = lines.length - margin.bottom; i < lines.length; i++) {
        expect(lines[i].length).to.equal(0)
      }
    }
  })
})
