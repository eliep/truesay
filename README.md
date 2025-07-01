# truesay

![CI](https://github.com/eliep/truesay/workflows/CI/badge.svg) 
![npm](https://github.com/eliep/truesay/workflows/publish/badge.svg)

`truesay` is a command line utility displaying a text alongside an image 
in your terminal. `truesay` render the image with UTF-8 character and ANSI
escape code.

![truesay screenshot](./screenshot-lucca.png?raw=true)

## Installation

```bash
> npm install -g truesay
```

## Usage

```bash
> truesay <path-to-image-or-directory> [options]
> fortune | truesay <path-to-image-or-directory> [options]
```

### Options

Option | Description
-------| -------------
`-t, --text` | Text to say. If omitted, stdin is used
`-b, --box` | Text box style: `round` (default), `single`, `double`, `singleDouble`, `doubleSingle`, `classic`, `none`
`-c, --background-color` | Background color used to simulate image transparency (`#rrggbb` format)
`-w, --width` | Width (default: terminal width minus margin left and right)
`-p, --position` | Text box position: `top` (default) or `right`
`-r, --resolution` | Image resolution: `high` (default, 1 pixel is half a character) or `low` (1 pixel is 2 characters wide)'
`-P, --padding` | Padding between art and text (default: `0`)
`-T, --margin-top` | Top margin in pixel (default: `1`)
`-R, --margin-right` | Right margin in pixel (default: `1`)
`-B, --margin-bottom` | Bottom margin in pixel (default: `0`)
`-L, --margin-left` | Left margin in pixel (default: `1`)

### Image format and resolution
`truesay` has one mandatory parameter which is an image path. 
This path can be absolute or relative and must point to either an image file 
(*gif*, *jpg* or *png*) or a directory containing at least one image file.

#### Image format
There's only three formats accepted for the image: *gif*, *jpg* and *png*. 

#### Random pick in directory
If the image path is a directory, `truesay` will recursively list all files in
that directory, keep only the image files and choose among these one to display at random.  

#### Image resolution
There are two resolutions for the image rendering, available via the `-r` option:

- *high* (default): in high resolution, each image pixel is rendered by half a character.
- *low*: in low resolution, each image pixel is rendered by two characters.

In practice, low resolution rendering take twice the space of high resolution 
for the same image.

#### Transparency and background option:
Some image formats like `png` allow pixel to be transparent.

By default: 

- if a pixel is fully transparent, `truesay` will ignore its rgb value,
- if a pixel is semi transparent, `truesay` will ignore its transparency value.

However, to better handle semi transparent pixel, 
it's possible to use the `-c` option to pass the terminal background color 
(in `#rrggbb` format). 
`truesay` will then use this color to emulate transparency 
by computing the rendering color of semi transparent pixel.

```bash
> fortune | truesay distro/32/tux -c '#2c3440'
```

Below a comparison with and without the `-c` option:

![truesay screenshot](./screenshot-bg.png?raw=true)

### Text input
By default, `truesay` reads its text input from `stdin` but 
this can be overridden by setting the `-t` option to display a given text:

 ```bash
 > echo 'Hello world!' | truesay games/link # diplay 'Hello world!' from stdin
 > truesay games/link -t 'Hello world!'     # diplay 'Hello world!' from -t option
 > fortune | truesay games/link             # diplay a random fortune
 ```

### Text position
The `-p` option allows to control the text position relative to the image. 
By default, the text is on top of the image (`-p top`), 
but it can also be displayed next to this image (`-p right`)

```bash
> truesay games/link -t 'Hello world!' -p right
```

### Width, margin and padding 

#### Width
By default, `truesay` uses all the horizontal space available 
to display it's output. By using the width option `-w`, 
it's possible to constrain the output to a given width (expressed in character). 
  
```bash
> truesay games/link -t 'Hello world!' -w 80
```

The given width includes the space available for the box, the text, 
and the right and left margin (see below). 

#### Margin
`truesay` has 4 margin options to add extra space around its output,
one for each direction: `-T` (top), `-R` (right), `-B` (bottom), `-L` (left).
For example, the above command will add one blank line 
before the text box and one blank column to the left of the image and text box:

```bash
> truesay games/link -t 'Hello world!' -T 1 -L 1
```

#### Padding
The padding option `-P` allows to add some extra space 
between the text box and the image:

```bash
> truesay games/link -t 'Hello world!' -P 1 -p right
```
 
### Box style
The box style can be set with the `-b` option, 6 styles are available to choose from: 

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

`-b` option also accepts two special values:

- `none`: disable text boxing,
- `colors`: the first 8 terminal colors are printed under the text


![truesay screenshot](./screenshot-cobra.png?raw=true)

 
