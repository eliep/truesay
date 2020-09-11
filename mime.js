const fs = require('fs')

function startWith(headers, buffer) {
  for (const [index, header] of headers.entries()) {
    if (header !== buffer[index]) {
      return false;
    }
  }
  return true
}

const mime = (path) => {
  const fd = fs.openSync(path, 'r')
  let buffer = Buffer.alloc(100);
  fs.readSync(fd, buffer, 0, 8, 0)
  let mime = 'ansi'
  if (startWith([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A], buffer)) {
    mime = 'png'
  } else if (startWith([0xFF, 0xD8, 0xFF], buffer)) {
    mime = 'jpg'
  } else if (startWith([0x47, 0x49, 0x46], buffer)) {
    mime = 'gif'
  }
  return mime
}

module.exports = mime