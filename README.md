# truesay

![CI](https://github.com/eliep/truesay/workflows/CI/badge.svg)

`truesay` is a command line utility displaying a text, and an image 
in a true color enabled terminal.

## Installation

```bash
> npm install -g truesay
```

## Usage

```bash
> truesay <path-to-image> [options]
```

### Image format and resolution
`truesay` has one mandatory parameter which is the path to an image. 
This path can be absolute or relative and must point to either an image file 
(gif, jpg or png) or a directory containing at least one image file.

#### Image format
There's only three formats accepted for the image: gif, jpg and png. 

#### Random pick in directory
If the image path is a directory, `truesay` will recursively list all files in
this directory, keep only the image files and choose among these one to display at random.  

#### Image resolution


#### Transparency



### Text input
By default, `truesay` read its text input from `stdin` but 
this can be override by setting the `-t` option to display a given text:

 ```bash
 > echo 'Hello world!' | truesay games/link # diplay 'Hello world!' from stdin
 > truesay games/link -t 'Hello world!'     # diplay 'Hello world!' from -t option
 > fortune | truesay games/link             # diplay a random fortune
 ```

### Text position
The `-pos` option allow to control the text position relative to the image. 
By default, the text is on top of the image (`-pos top`), but it can also be displayed
next to this image (`-pos right`)

### Width, margin and padding 

#### Width
By default, `truesay` use all the horizontal space available to display it's output. 
By using the width option `-w`, it's possible to constrain the output to a given width 
(expressed in character). 
  
```bash
> truesay games/link -t 'Hello world!' -w 80
```

The width given include the space available for the box, the text, 
and the right and left margin (see below). 

#### Margin
`truesay` has 4 margin options to add extra space around its output,
one for each direction: `-mt` (top), `-mr` (right), `-mb` (bottom), `-ml` (left).
For example, the above command will add one blank line before the text box and one
blank column to the left of the image and text box:

```bash
> truesay games/link -t 'Hello world!' -mt 1 -ml 1
```

#### Padding
The padding option `-p` allow to add some extra space 
between the text box and the image:

```bash
> truesay games/link -t 'Hello world!' -p 1 -pos right
```
 
### Box style
The box style can be set with the `-b` option, 6 values are available: 

``` 
╭───────╮
│ round │
╰───────╯
┌────────┐
│ single │
└────────┘
╔════════╗
║ double ║
╚════════╝
╓──────────────╖
║ singleDouble ║
╙──────────────╜
╒══════════════╕
│ doubleSingle │
╘══════════════╛
+---------+
| classic |
+---------+
```

### Options

Option | Description
-------| -------------
`-t, --text` | Text to say. If omitted, stdin is used
`-b, --box` | Text box style: `round` (default), `single`, `double`, `single-double`, `double-single`, `classic`
`-bg, --background` | Background color used to simulate image transparency (`#rrggbb` format)
`-w, --width` | Width (default: terminal width minus margin left and right)
`-pos, --position` | Text box position: `top` (default) or `right`
`-r, --resolution` | Image resolution: `high` (default, 1 pixel is half a character) or `low` (1 pixel is 2 characters wide)'
`-p, --padding` | Padding between art and text (default: `0`)
`-mt, --margin-top` | Top margin in pixel (default: `1`)
`-mr, --margin-right` | Right margin in pixel (default: `1`)
`-mb, --margin-bottom` | Bottom margin in pixel (default: `0`)
`-ml, --margin-left` | Left margin in pixel (default: `1`)
 
### Included images


### Examples




 