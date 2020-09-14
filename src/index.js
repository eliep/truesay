#!/usr/bin/env node

const fs = require('fs')
const { resolve } = require("path")
const { program } = require('commander')
const mime = require('./mime')
const layout = require('./layout')
const convertToAnsi = require('./ansi')

function assertImageFile(artPath) {
  let type
  try {
    if (!fs.existsSync(artPath) && !resolve(__dirname, '../art', artPath + '.png')) {
      console.error(`Art path ${artPath} does not exists`)
      process.exit(1)
    }
    if (!fs.existsSync(artPath)) {
      artPath = resolve(__dirname, '../art', artPath + '.png')
    }
    type = mime(artPath)
    if (!type) {
      console.error('Image type must be either png, gif or jpeg')
      process.exit(1)
    }
    return artPath
  } catch (error) {
    console.error('Unable to detect file type:\n', error.message)
    process.exit(1)
  }
}

program
  .arguments('<art_path>', )
  .description('Use colored ANSI text at <art_path> to say something.\n' +
    '\'truesay say -h\' for help')
  .option('-t, --text <value>', 'Text to say. If omitted, stdin is used')
  .option('-b, --box <value>', 'Text box type: round (default), single, double, single-double, double-single, classic')
  .option('-bg, --background <value>', 'Background color used to simulate image transparency (#rrggbb format)')
  .option('-w, --width <number>', 'Width (default: terminal width minus margins)', parseInt)
  .option('-pos, --position <value>', 'Text box position: \'top\' (default) or \'right\'')
  .option('-r, --resolution <value>', 'Image resolution: \'high\' (default, 1 pixel is half a character) or ' +
    '\'low\' (1 pixel is 2 characters wide)')
  .option('-p, --padding <value>', 'Padding between art and text', parseInt)
  .option('-mt, --margin-top <value>', 'Top margin in pixel (default: 1)', parseInt)
  .option('-mr, --margin-right <value>', 'Right margin in pixel (default: 1)', parseInt)
  .option('-mb, --margin-bottom <value>', 'Bottom margin in pixel (default: 0)', parseInt)
  .option('-ml, --margin-left <value>', 'Left margin in pixel (default: 1)', parseInt)
  .action(function (artPath, cmdObj) {
    artPath = assertImageFile(artPath);

    const text = cmdObj.text || fs.readFileSync(0).toString()
    const boxType = cmdObj.box || 'round'
    const background = cmdObj.background
    const position = cmdObj.position || 'top'
    const paddingSize = cmdObj.padding || 0
    const margin = {
      left: cmdObj.marginLeft || 1,
      right: cmdObj.marginRight || 1,
      top: cmdObj.marginTop || 1,
      bottom: cmdObj.marginBottom || 0
    }
    const resolution = cmdObj.resolution || 'high'
    const maxWidth = cmdObj.width || process.stdout.columns - margin.left - margin.right

    const callback = (art) => {
      const output = layout({
        art,
        text,
        position,
        paddingSize,
        margin,
        maxWidth,
        bubbleOptions: { boxType }
      })
      console.log(output)
    }

    convertToAnsi(artPath, background, resolution, callback)
  })

program.parse(process.argv)
