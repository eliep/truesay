
const box = require('./box')

function getMaxTextWidth (textLines) {
  let maxTextLength = 0
  for (const textLine of textLines) {
    if (textLine.length > maxTextLength) {
      maxTextLength = textLine.length
    }
  }
  return maxTextLength
}

function getMaxArtWidth (artLines) {
  let maxArtLength = 0
  for (const artLine of artLines) {
    const length = (artLine.match(/[ \u2584\u2580]/g) || []).length
    if (length > maxArtLength) {
      maxArtLength = length
    }
  }
  return maxArtLength
}

function pad (text, size) {
  return text.split('\n').map(line => ' '.repeat(size) + line).join('\n')
}

function buildTopLayout (options) {
  const { art, text, paddingSize, margin, maxWidth, bubbleOptions } = options || {}

  const textLines = text.split('\n')
  const maxTextLength = getMaxTextWidth(textLines)
  bubbleOptions.boxWidth = Math.max(Math.min(maxTextLength + 4, maxWidth - margin.left - margin.right), 5)

  const textBox = box.get(text, bubbleOptions)
  const padding = '\n'.repeat(paddingSize + 1)
  return '\n'.repeat(margin.top) + pad(`${textBox}${padding}${art}`, margin.left) + '\n'.repeat(margin.bottom)
}

function buildRightLayout (options) {
  const { art, text, paddingSize, margin, maxWidth, bubbleOptions } = options || {}

  const artLines = art.split('\n')
  const maxArtWidth = getMaxArtWidth(artLines)
  const textLines = text.split('\n')
  const maxTextWidth = getMaxTextWidth(textLines)

  bubbleOptions.boxWidth = Math.max(Math.min(maxTextWidth + 4, maxWidth - maxArtWidth - paddingSize - margin.left - margin.right), 5)
  const textBox = box.get(text, bubbleOptions)
  const bubbleLines = textBox.split('\n')

  let bubbleIndex
  const resultLines = []
  for (bubbleIndex = 0; bubbleIndex < bubbleLines.length - artLines.length + 1; bubbleIndex++) {
    resultLines[bubbleIndex] = pad(' '.repeat(maxArtWidth) + ' '.repeat(paddingSize) + bubbleLines[bubbleIndex], margin.left)
  }

  let artIndex = 0
  while (artIndex < artLines.length - 1) {
    const bubbleLine = (bubbleLines.length > bubbleIndex) ? bubbleLines[bubbleIndex] : ''
    resultLines[bubbleIndex] = pad(artLines[artIndex] + ' '.repeat(paddingSize) + bubbleLine, margin.left)
    artIndex++
    bubbleIndex++
  }
  return '\n'.repeat(margin.top) + resultLines.join('\n') + '\n'.repeat(margin.bottom + 1)
}

function layout (options) {
  options.text = options.text.split('\t').join('   ')
  switch (options.position) {
    case 'top':
      options.bubbleOptions.spikeDirection = 'right'
      options.bubbleOptions.spikePosition = 10
      return buildTopLayout(options)
    case 'right':
    default:
      options.bubbleOptions.spikeDirection = 'left'
      options.bubbleOptions.spikePosition = 2
      return buildRightLayout(options)
  }
}

module.exports = layout
