module.exports = function(driver) {
  return function (chai, utils) {
    chai.Assertion.addProperty('exec', function() {
      return utils.flag(this, 'exec', true)
    })

    var properties = [
      'empty',
      'exist',
      'false',
      'NaN',
      'null',
      'ok',
      'true',
      'undefined'
    ]
    properties.forEach(function (p) {
      chai.Assertion.overwriteProperty(p, function (_super) {
        return assertScript(_super)
      })
    })

    var methods = [
      'above',
      'approximately',
      'below',
      'closeTo',
      'eql',
      'equal',
      'gt',
      'gte',
      'greaterThan',
      'haveOwnProperty',
      'haveOwnPropertyDescriptor',
      'instanceof',
      'instanceOf',
      'keys',
      'key',
      'least',
      'lengthOf',
      'lessThan',
      'lt',
      'lte',
      'match',
      'matches',
      'members',
      'most',
      'oneOf',
      'ownProperty',
      'ownPropertyDescriptor',
      'property',
      'satisfy',
      'satisfies',
      'string',
      'within'
    ]
    methods.forEach(function (m) {
      chai.Assertion.overwriteMethod(m, function (_super) {
        return assertScript(_super)
      })
    })

    var chainableMethods = [
      'a',
      'an',
      'contain',
      'contains',
      'include',
      'includes'
    ]
    chainableMethods.forEach(function (m) {
      chai.Assertion.overwriteChainableMethod(m, function (_super) {
        return assertScript(_super)
      }, function(_super) {
        return function() {
          _super.apply(this, arguments);
        }
      })
    })

    function assertScript(_super) {
      return function() {
        if (utils.flag(this, 'exec')) {
          var obj = this._obj
          var self = this
          var args = arguments
          var done = arguments[arguments.length - 1]
          var message = utils.flag(this, 'message')
          message = (obj+'').replace(/\n\s*/g, '  ') + (message !== undefined ? ': ' + message : '')
          var err = new Error()
          return driver.executeScript(obj).then(function (result) {
            var assert = new chai.Assertion(result, message)
            utils.transferFlags(self, assert, false) // false means don't transfer `object` flag
            utils.flag(assert, 'exec', undefined) // remove the `exec` flag
            try {
              _super.apply(assert, args)
            } catch(e) {
              e.stack = err.stack // show the correct error stack
              throw e
            }
            return typeof done === "function" ? done() : void 0
          })
        } else {
          _super.apply(this, arguments)
        }
      }
    }
  }
}