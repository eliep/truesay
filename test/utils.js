const { describe, it, before } = require('mocha')
const expect = require('chai').expect
const sinon = require('sinon')
const { resolve } = require('path')
const { assertPath, mime } = require('../src/utils')

describe('mime function', function () {
  it('should return \'gif\' for gif file', function () {
    const type = mime(resolve('test/resources/zelda/zelda-head.gif'))
    expect(type).to.equal('gif')
  })

  it('should return \'jpg\' for jpg file', function () {
    const type = mime(resolve('test/resources/zelda/zelda-head.jpg'))
    expect(type).to.equal('jpg')
  })

  it('should return \'png\' for png file', function () {
    const type = mime(resolve('test/resources/zelda/zelda-head.png'))
    expect(type).to.equal('png')
  })

  it('should return null for any other file type', function () {
    const type = mime(resolve('test/resources/zelda/zelda-head.ansi'))
    expect(type).to.be.null
  })

  it('should throw an error if the file is unreadable', function () {
    expect(() => {
      mime(resolve('test/resources/zelda/zelda-head'))
    }).to.throw(Error)
  })
})

describe('assertPath function', function () {
  before(() => {
    sinon.stub(process, 'exit')
    sinon.stub(console, 'error')
  })

  it('should return the same path, if it\'s an image', function () {
    const path = resolve(__dirname, './resources/distro/32/fedora.png')
    expect(assertPath(path)).to.be.equal(path)
  })

  it('should return the full path, if it\'s a reference to an internal image', function () {
    const path = 'distro/32/fedora'
    expect(assertPath(path)).to.match(/\/truesay\/art\/distro\/32\/fedora\.png$/)
  })

  it('should call process.exit(1) if the path is not an image', function () {
    const path = resolve(__dirname, './resources/distro/32/fedora-bg-high.ansi')
    assertPath(path)
    sinon.assert.calledWith(process.exit, 1)
  })
})
