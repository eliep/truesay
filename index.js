#!/usr/bin/env node

const fs = require('fs')
const { program } = require('commander')
const chatBubble = require('node-chat-bubble')
const mime = require('./mime')
const { readAnsiFile, convertToAnsi } = require('./ansi')

function buildTop(options) {
  const { art, text, bubbleOptions } = options || {}
  return (text) ? `${chatBubble.get(text, bubbleOptions)} \n ${art}` : art
}

function buildRight(options) {
  const { art, text, margin, bubbleOptions } = options || {}

  const artLines = art.split('\n')
  let maxLength = 0
  let maxSpace
  for (const artLine of artLines) {
    if (artLine.length > maxLength) {
      maxLength = artLine.length
      maxSpace = artLine.split(' ').length - 1
    }
  }

  const boxWidth = bubbleOptions.boxWidth - maxSpace - margin
  bubbleOptions.boxWidth = (boxWidth >= 5) ? boxWidth : 5
  const bubble = chatBubble.get(text, bubbleOptions)
  const bubbleLines = bubble.split('\n')

  let bubbleIndex
  let resultLines = []
  for (bubbleIndex = 0; bubbleIndex < bubbleLines.length - artLines.length + 1; bubbleIndex++) {
    resultLines[bubbleIndex] = ' '.repeat(maxSpace) + ' '.repeat(margin) + bubbleLines[bubbleIndex]
  }

  let artIndex = 0
  let remainingBubbleIndex = bubbleIndex
  while (artIndex < artLines.length - 1) {
    let artLine = artLines[artIndex]
    let bubbleLine = (bubbleLines.length > remainingBubbleIndex) ? bubbleLines[remainingBubbleIndex] : ''
    resultLines[bubbleIndex + artIndex] = artLine + ' '.repeat(margin) + bubbleLine
    artIndex++
    remainingBubbleIndex++
  }
  resultLines.push("")
  return resultLines.join('\n')
}

function build(options) {
  switch (options.position) {
    case 'top':
      options.bubbleOptions.spikeDirection = "right"
      options.bubbleOptions.spikePosition = 10
      return buildTop(options)
    case 'right':
    default:
      options.bubbleOptions.spikeDirection = "left"
      options.bubbleOptions.spikePosition = 2
      return buildRight(options)
  }
}

program
  .command('say <art_path>', )
  .description('Use colored ANSI text at <art_path> to say something.\n' +
    '\'truesay say -h\' for help')
  .option('-t, --text <value>', 'Text to say. If omitted, stdin is used')
  .option('-w, --width <number>', 'Width (default: 80)', parseInt)
  .option('-p, --position <value>', 'Text bubble position: \'top\' (default) or \'right\'')
  .option('-m, --margin <value>', 'Margin between art and text if position = \'right\' (default: 0)', parseInt)
  .action(function (artPath, cmdObj) {
    const text = cmdObj.text || fs.readFileSync(0).toString()
    const width = cmdObj.width || 80
    const position = cmdObj.position || 'top'
    const margin = cmdObj.margin || 0
    const type = mime(artPath)
    const callback = (art) => {
      const output = build({
        art,
        text,
        position,
        margin,
        bubbleOptions: { boxWidth: width, boxType: "double" }
      })
      console.log(output)
    }
    if (type !== 'ansi') {
      convertToAnsi(artPath, callback)
    } else {
      readAnsiFile(artPath, callback)
    }
  })

program
  .command('gen <img_path>')
  .description('Convert image (png, jpg, gif) at <img_path> into colored ANSI text using true color.\n' +
    '\'truesay gen -h\' for help')
  .action(function (imgPath) {
    convertToAnsi(imgPath, (art) => {
      console.log(art)
    })
  })

program.parse(process.argv)
