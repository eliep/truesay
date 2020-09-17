const { describe, it } = require('mocha')
const expect = require('chai').expect
const { resolve } = require('path')
const mime = require('../src/mime')

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
