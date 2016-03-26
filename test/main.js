var path = require('path')
var webdriver = require('selenium-webdriver'),
  test = require('selenium-webdriver/testing')

var driver = new webdriver.Builder()
  .forBrowser('firefox')
  .build()

var chai = require('chai')
var expect = chai.expect

var chaiWebdriverExec = require('../index')
chai.use(chaiWebdriverExec(driver))


test.describe('chai-webdriver-exec', function() {
  this.timeout(20000)

  test.before(function() {
    driver.get('http://google.com')
  })

  test.after(function() {
    driver.quit()
  })
  
  test.it('works with properties', function() {
    expect('return document.isEqualNode(document.body)').exec.to.be.false
    expect('return document.querySelectorAll(".nonexistent")').exec.to.be.empty
    expect('return window.notdefined').exec.to.be.null
    expect('return document').exec.to.be.ok
    expect('return document.isEqualNode(document.body)').exec.to.be.false
    expect('return document.isEqualNode(document.body)').exec.to.not.be.true
    expect('return window.scrollX').exec.to.not.be.NaN
    expect('return document.body').exec.to.exist
  })

  test.it('works with methods', function() {
    expect('return document.querySelectorAll("head")').exec.to.have.lengthOf(1)
    expect('return window.scrollX').exec.to.be.a('number')
    expect('return window.scrollX').exec.to.be.an('number')
    expect('return document.childElementCount').exec.to.equal(1)
    expect('return window.toString()').exec.to.contain('object')
    expect('return window.toString()').exec.to.match(/^\[object/)
    expect('return window.toString()').exec.to.have.string('object')
    expect('return {}').exec.to.be.an.instanceof(Object)
    expect('return {foo: "foo", bar: 2}').exec.to.include.keys('foo')
    expect('return document.childElementCount').exec.to.be.above(0)
    expect('return document.childElementCount').exec.to.be.at.least(1)
    expect('return document.childElementCount').exec.to.be.below(2)
    expect('return document.childElementCount').exec.to.be.at.most(1)
    expect('return document.childElementCount').exec.to.be.within(0, 1)
    expect('return document.childElementCount').exec.to.be.closeTo(0, 1)
    expect('return document.childElementCount').exec.to.satisfy(function(end) { return end === 1 })
    expect('return document.childElementCount').exec.to.be.oneOf([1, 2])
    expect('return {foo: "foo", bar: 2}').exec.to.have.property('foo')
    expect('return {foo: "foo", bar: 2}').exec.to.have.property('bar', 2)
    expect('return {foo: "foo", bar: 2}').exec.to.have.ownProperty('bar')
    expect('return {foo: "foor", bar: "bar"}').exec.to.have.any.key('foo', 'qux')
    expect('return {foo: "foor", bar: "bar"}').exec.to.have.all.key('foo', 'bar')
  })

  test.it('works with functions', function() {
    expect(function() {
      return [document.childElementCount, document.childElementCount]
    }).exec.to.eql([1, 1])
    expect(function() {
      return [document.childElementCount, document.childElementCount]
    }).exec.to.deep.equal([1, 1])
    expect(function() {
      return [document.childElementCount, document.childElementCount]
    }).exec.to.include(1)
    expect(function() {
      return [document.childElementCount, document.childElementCount]
    }).exec.to.include.members([1, 1])
  })

  test.it('uses description to prevent mocha issue https://github.com/mochajs/mocha/issues/1065#issuecomment-201922675', function() {
    expect('return window.scrollX', '(exec)').exec.to.be.a('number')
  })

  test.it('uses the asynchronous flow', function() {
    expect('return {foo: "foo", bar: 2}').exec.to.have.ownProperty('bar', function() {
      console.log('has property `bar`')
    })
    expect('return {foo: "foo", bar: 2}').exec.to.have.ownProperty('foo').then(function() {
      console.log('has property `foo`')
    })
  })
})