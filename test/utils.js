const { describe, it, before } = require('mocha')
const expect = require('chai').expect
const sinon = require('sinon')
const { resolve } = require('path')
const assertImageFile = require('../src/utils')

describe('assertImageFile function', function () {
  before(() => {
    sinon.stub(process, 'exit')
    sinon.stub(console, 'error')
  })

  it('should return the same path, if it\'s an image', function () {
    const path = resolve(__dirname, './resources/distro/32/fedora.png')
    expect(assertImageFile(path)).to.be.equal(path)
  })

  it('should return the full path, if it\'s a reference to an internal image', function () {
    const path = 'distro/32/fedora'
    expect(assertImageFile(path)).to.match(/\/truesay\/art\/distro\/32\/fedora\.png$/)
  })

  it('should call process.exit(1) if the path is not an image', function () {
    const path = resolve(__dirname, './resources/distro/32/fedora-bg-high.ansi')
    assertImageFile(path)
    sinon.assert.calledWith(process.exit, 1)
  })
})
