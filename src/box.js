'use strict'
// copied from https://github.com/gauravchl/node-chat-bubble to fix boxWidth computation

const wrapAnsi = require('wrap-ansi')
const cliBoxes = require('cli-boxes')
const stringLength = require('string-length')

const defaultOptions = {
  boxWidth: 30,
  spikeDirection: 'right',
  spikePosition: 10,
  boxType: 'round'
}

const wrap = (message, options) => {
  const boxSpace = (options.boxType === 'none') ? 0 : 4
  const width = Math.min(options.boxWidth, stringLength(message) + boxSpace)
  const lines = wrapAnsi(message, width - boxSpace, { hard: true }).split(/\n/)
  return { width, lines }
}

const get = (message, options) => {
  options = Object.assign(defaultOptions, options)
  const { width, lines } = wrap(message, options)
  if (options.boxType === 'none') {
    return lines.join('\n')
  }

  const spikePosition = Math.min(options.spikePosition, width / 2)
  const boxType = options.boxType
  const spikeDirection = options.spikeDirection

  const boxChars = cliBoxes[boxType]
  const topBorder = boxChars.topLeft + boxChars.horizontal.repeat(width - 2) + boxChars.topRight
  const bottomBorder = boxChars.bottomLeft + boxChars.horizontal.repeat(width - 2) + boxChars.bottomRight

  const paddedLines = lines.map(line => {
    const rightPaddingCount = width - 4 - stringLength(line)
    const rightPadding = ' '.repeat(Math.max(rightPaddingCount, 0))
    return boxChars.vertical + ' ' + line + ' ' + rightPadding + boxChars.vertical
  })

  const result = topBorder + '\n' + paddedLines.join('\n') + '\n' + bottomBorder
  const spike = spikeDirection === 'right' ? '\\' : '/'
  return result + '\n' + ' '.repeat(spikePosition) + spike
}

module.exports = { get }
