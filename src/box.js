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

const getBox = (message, options) => {
  options = Object.assign(defaultOptions, options)
  const boxWidth = Math.min(options.boxWidth, stringLength(message) + 4)
  const spikePosition = Math.min(options.spikePosition, boxWidth / 2)
  const boxType = options.boxType
  const spikeDirection = options.spikeDirection

  const boxChars = cliBoxes[boxType]
  const topBorder = boxChars.topLeft + boxChars.horizontal.repeat(boxWidth - 2) + boxChars.topRight
  const bottomBorder = boxChars.bottomLeft + boxChars.horizontal.repeat(boxWidth - 2) + boxChars.bottomRight

  let lines = wrapAnsi(message, boxWidth - 4, { hard: true }).split(/\n/)

  lines = lines.map(line => {
    const rightPaddingCount = boxWidth - 4 - stringLength(line)
    const rightPadding = ' '.repeat(Math.max(rightPaddingCount, 0))
    return boxChars.vertical + ' ' + line + ' ' + rightPadding + boxChars.vertical
  })

  const result = topBorder + '\n' + lines.join('\n') + '\n' + bottomBorder
  const spike = spikeDirection === 'right' ? '\\' : '/'
  return result + '\n' + ' '.repeat(spikePosition) + spike
}

module.exports = { get: getBox }
