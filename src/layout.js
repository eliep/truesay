
const box = require('./box')

const getMaxTextWidth = (textLines) => {
  let maxTextWidth = 0
  for (const textLine of textLines) {
    if (textLine.length > maxTextWidth) {
      maxTextWidth = textLine.length
    }
  }
  return maxTextWidth
}

const getMaxArtWidth = (artLines) => {
  let maxArtWidth = 0
  for (const artLine of artLines) {
    const width = (artLine.match(/[ \u2584\u2580]/g) || []).length
    if (width > maxArtWidth) {
      maxArtWidth = width
    }
  }
  return maxArtWidth
}

const pad = (text, size) => {
  return text.split('\n').map(line => ' '.repeat(size) + line).join('\n')
}

const buildTopLayout = (options) => {
  const { art, text, paddingSize, margin, maxWidth, boxOptions } = options || {}

  const textLines = text.split('\n')
  const maxTextWidth = getMaxTextWidth(textLines)
  boxOptions.boxWidth = Math.max(Math.min(maxTextWidth + 4, maxWidth - margin.left - margin.right), 5)

  const textBox = box.get(text, boxOptions)
  const padding = '\n'.repeat(paddingSize + 1)
  return '\n'.repeat(margin.top) + pad(`${textBox}${padding}${art}`, margin.left) + '\n'.repeat(margin.bottom)
}

const buildRightLayout = (options) => {
  const { art, text, paddingSize, margin, maxWidth, boxOptions } = options || {}

  const artLines = art.split('\n')
  const maxArtWidth = getMaxArtWidth(artLines)
  const textLines = text.split('\n')
  const maxTextWidth = getMaxTextWidth(textLines)

  boxOptions.boxWidth = Math.max(Math.min(maxTextWidth + 4, maxWidth - maxArtWidth - paddingSize - margin.left - margin.right), 5)
  const textBox = box.get(text, boxOptions)
  const boxedLines = textBox.split('\n')

  let index
  const resultLines = []
  for (index = 0; index < boxedLines.length - artLines.length + 1; index++) {
    resultLines[index] = pad(' '.repeat(maxArtWidth) + ' '.repeat(paddingSize) + boxedLines[index], margin.left)
  }

  let artIndex = 0
  while (artIndex < artLines.length - 1) {
    const boxedLine = (index < boxedLines.length) ? boxedLines[index] : ''
    resultLines[index] = pad(artLines[artIndex] + ' '.repeat(paddingSize) + boxedLine, margin.left)
    artIndex++
    index++
  }
  return '\n'.repeat(margin.top) + resultLines.join('\n') + '\n'.repeat(margin.bottom + 1)
}

const layout = (options) => {
  options.text = options.text.split('\t').join('   ')
  switch (options.position) {
    case 'top':
      options.boxOptions.spikeDirection = 'right'
      options.boxOptions.spikePosition = 10
      return buildTopLayout(options)
    case 'right':
    default:
      options.boxOptions.spikeDirection = 'left'
      options.boxOptions.spikePosition = 2
      return buildRightLayout(options)
  }
}

module.exports = layout
