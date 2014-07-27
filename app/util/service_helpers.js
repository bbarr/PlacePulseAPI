
var errors = require('feathers').errors.types
var tv4 = require('tv4')
var rsvp = require('rsvp')
var _ = require('lodash')
var config = require('config')

function fail(details) {
  return new rsvp.Promise(function(res, rej) { return rej(details) })
}

function toss(Type, details) {
  var e = new Error
  e.errors = details
  return fail(new Type(e))
}

var _errors = _.reduce(errors, function(memo, v, k) {
  memo[k] = _.partial(toss, v)
  return memo
}, {})

module.exports = {
  connectionString: process.env.MONGOLAB_URI || config.database.url,
  errors: errors,
  validator: function(schema) {
    return function(hook, next) {

      var results, error, valid

      if (hook.method === 'patch') {
        results = tv4.validateMultiple(hook.data, schema)
        error = results.errors[0]
        valid = !error || _.all(results.errors, { code: tv4.errorCodes.OBJECT_REQUIRED })
      } else {
        results = tv4.validateResult(hook.data, schema)
        error = results.error
        valid = results.valid
      }

      console.log(errors.BadRequest(error))

      if (!valid) return next(new errors.BadRequest(error))
      next()
    }
  }
}
