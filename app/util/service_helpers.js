
var errors = require('feathers').errors.types
var tv4 = require('tv4')
var _ = require('lodash')
var config = require('config')

function error(type, msg, data) {
  return new errors[type](msg)
}

var api = {
  connectionString: process.env.MONGOLAB_URI || config.database.url,
  errors: errors,
  error: error,
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

      if (valid) next()
      else next(new errors.BadRequest(error))
    }
  },
  authenticate: function(hook, next) {
    if (hook.params.currentUser) {
      next()
    } else {
      next(new error('NotAuthenticated'))
    }
  }
}

module.exports = api
