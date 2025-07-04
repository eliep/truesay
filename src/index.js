#!/usr/bin/env node

const fs = require('fs')
const { program } = require('commander')
const getPixels = require('get-pixels')
const { assertPath } = require('./utils')
const { convertToAnsi } = require('./ansi')
const layout = require('./layout')

program
  .arguments('<art_path>')
  .description('Use <art_path> image to say something.\n \'truesay -h\' for help')
  .option('-t, --text <value>', 'Text to say. If omitted, stdin is used')
  .option('-b, --box <value>',
    'Text box style: round (default), single, double, singleDouble, doubleSingle, classic, none, colors',
    'round')
  .option('-c, --background-color <value>', 'Background color used to simulate image transparency (#rrggbb format)')
  .option('-w, --width <number>', 'Width (default: terminal width minus margins)', parseInt)
  .option('-p, --position <value>', 'Text box position: \'top\' (default) or \'right\'', 'top')
  .option('-r, --resolution <value>', 'Image resolution: \'high\' (default, 1 pixel is half a character) or ' +
    '\'low\' (1 pixel is 2 characters wide)', 'high')
  .option('-P, --padding <value>', 'Padding between art and text', parseInt)
  .option('-T, --margin-top <value>', 'Top margin in pixel (default: 1)', parseInt)
  .option('-R, --margin-right <value>', 'Right margin in pixel (default: 1)', parseInt)
  .option('-B, --margin-bottom <value>', 'Bottom margin in pixel (default: 0)', parseInt)
  .option('-L, --margin-left <value>', 'Left margin in pixel (default: 1)', parseInt)
  .action((artPath, cmdObj) => {
    artPath = assertPath(artPath)

    const text = cmdObj.text || fs.readFileSync(0).toString().slice(0, -1)
    const boxType = cmdObj.box || 'round'
    const background = cmdObj.background
    const position = cmdObj.position || 'top'
    const paddingSize = cmdObj.padding || 0
    const margin = {
      left: cmdObj.marginLeft === undefined ? 1 : cmdObj.marginLeft,
      right: cmdObj.marginRight === undefined ? 1 : cmdObj.marginRight,
      top: cmdObj.marginTop === undefined ? 1 : cmdObj.marginTop,
      bottom: cmdObj.marginBottom || 0
    }
    const resolution = cmdObj.resolution || 'high'
    const maxWidth = cmdObj.width || process.stdout.columns - margin.left - margin.right
    getPixels(artPath, (err, pixels) => {
      if (err) {
        console.error('Error: Bad image path')
        process.exit(1)
      }
      const art = convertToAnsi(pixels, background, resolution)
      const output = layout({ art, text, position, paddingSize, margin, maxWidth, boxOptions: { boxType } })
      console.log(output)
    })
  })

program.parse(process.argv)
