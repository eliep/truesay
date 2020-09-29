const { describe, it } = require('mocha')
const expect = require('chai').expect
const fs = require('fs')
const getPixels = require('get-pixels')
const { convertToAnsi } = require('../src/ansi')

describe('convertToAnsi function', function () {
  it('should match low resolution, no background ainsi file', function (done) {
    const expected = fs.readFileSync('test/resources/distro/32/fedora-no-bg-low.ansi', 'utf8')
    getPixels('test/resources/distro/32/fedora.png', function (err, pixels) {
      expect(err).to.be.null
      const art = convertToAnsi(pixels, null, 'low') + '\n'
      expect(art).to.equal(expected)
      done()
    })
  })

  it('should match low resolution, background ainsi file', function (done) {
    const expected = fs.readFileSync('test/resources/distro/32/fedora-bg-low.ansi', 'utf8')
    getPixels('test/resources/distro/32/fedora.png', function (err, pixels) {
      expect(err).to.be.null
      const art = convertToAnsi(pixels, '#2c313d', 'low') + '\n'
      expect(art).to.equal(expected)
      done()
    })
  })

  it('should match high resolution, no background ainsi file', function (done) {
    const expected = fs.readFileSync('test/resources/distro/32/fedora-no-bg-high.ansi', 'utf8')
    getPixels('test/resources/distro/32/fedora.png', function (err, pixels) {
      expect(err).to.be.null
      const art = convertToAnsi(pixels, null, 'high') + '\n'
      expect(art).to.equal(expected)
      done()
    })
  })

  it('should match high resolution, background ainsi file', function (done) {
    const expected = fs.readFileSync('test/resources/distro/32/fedora-bg-high.ansi', 'utf8')
    getPixels('test/resources/distro/32/fedora.png', function (err, pixels) {
      expect(err).to.be.null
      const art = convertToAnsi(pixels, '#2c313d', 'high') + '\n'
      expect(art).to.equal(expected)
      done()
    })
  })
})
