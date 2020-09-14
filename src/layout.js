
const chatBubble = require('node-chat-bubble')

function getMaxTextWidth(textLines) {
  let maxTextLength = 0
  for (const textLine of textLines) {
    if (textLine.length > maxTextLength) {
      maxTextLength = textLine.length
    }
  }
  return maxTextLength
}

function getMaxArtWidth(artLines) {
  let maxArtLength = 0
  for (const artLine of artLines) {
    const length = (artLine.match(/[ \u2584\u2580]/g) || []).length
    if (length > maxArtLength) {
      maxArtLength = length
    }
  }
  return maxArtLength
}

function pad(text, size) {
  return text.split('\n').map(line => ' '.repeat(size) + line).join('\n')
}

function buildTopLayout(options) {
  const { art, text, paddingSize, margin, maxWidth, bubbleOptions } = options || {}

  const textLines = text.split('\n')
  let maxTextLength = getMaxTextWidth(textLines)
  const boxWidth = Math.min(maxTextLength + 4, maxWidth)
  bubbleOptions.boxWidth = (boxWidth >= 5) ? boxWidth : 5

  const bubble = chatBubble.get(text, bubbleOptions)
  const padding = '\n'.repeat(paddingSize+1)
  return (text)
    ? '\n'.repeat(margin.top) + pad(`${bubble}${padding}${art}`, margin.left) + '\n'.repeat(margin.bottom)
    : art
}

function buildRightLayout(options) {
  const { art, text, paddingSize, margin, maxWidth, bubbleOptions } = options || {}

  const artLines = art.split('\n')
  const maxArtWidth = getMaxArtWidth(artLines)
  const textLines = text.split('\n')
  const maxTextWidth = getMaxTextWidth(textLines)

  bubbleOptions.boxWidth = Math.max(Math.min(maxTextWidth + 4, maxWidth - maxArtWidth - paddingSize), 5)
  const bubble = chatBubble.get(text, bubbleOptions)
  const bubbleLines = bubble.split('\n')

  let bubbleIndex
  let resultLines = []
  for (bubbleIndex = 0; bubbleIndex < bubbleLines.length - artLines.length + 1; bubbleIndex++) {
    resultLines[bubbleIndex] = pad(' '.repeat(maxArtWidth) + ' '.repeat(paddingSize) + bubbleLines[bubbleIndex], margin.left)
  }

  let artIndex = 0
  let remainingBubbleIndex = bubbleIndex
  while (artIndex < artLines.length - 1) {
    let artLine = artLines[artIndex]
    let bubbleLine = (bubbleLines.length > remainingBubbleIndex) ? bubbleLines[remainingBubbleIndex] : ''
    resultLines[bubbleIndex + artIndex] = pad(artLine + ' '.repeat(paddingSize) + bubbleLine, margin.left)
    artIndex++
    remainingBubbleIndex++
  }
  resultLines.push("")
  return '\n'.repeat(margin.top) + resultLines.join('\n') + '\n'.repeat(margin.bottom)
}

function layout(options) {
  switch (options.position) {
    case 'top':
      options.bubbleOptions.spikeDirection = "right"
      options.bubbleOptions.spikePosition = 10
      return buildTopLayout(options)
    case 'right':
    default:
      options.bubbleOptions.spikeDirection = "left"
      options.bubbleOptions.spikePosition = 2
      return buildRightLayout(options)
  }
}


module.exports = layout