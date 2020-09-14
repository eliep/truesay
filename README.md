# truesay

`truesay` is a command line utility displaying a text and an image in your terminal.

## Installation

```bash
$ npm install -g truesay
```

## Usage

```bash
$ truesay <path-to-image> [options]
```

### Text input

### Image format and resolution

### Margin and padding 

### Options

Option | Description
-------| -------------
`-t, --text` | Text to say. If omitted, stdin is used
`-b, --box` | Text box type: `round` (default), `single`, `double`, `single-double`, `double-single`, `classic`
`-bg, --background` | Background color used to simulate image transparency (`#rrggbb` format)
`-w, --width` | Width (default: terminal width minus margins)
`-pos, --position` | Text box position: `top` (default) or `right`
`-r, --resolution` | Image resolution: `high` (default, 1 pixel is half a character) or `low` (1 pixel is 2 characters wide)'
`-p, --padding` | Padding between art and text (default: `0`)
`-mt, --margin-top` | Top margin in pixel (default: `1`)
`-mr, --margin-right` | Right margin in pixel (default: `1`)
`-mb, --margin-bottom` | Bottom margin in pixel (default: `0`)
`-ml, --margin-left` | Left margin in pixel (default: `1`)
 
### Examples




 