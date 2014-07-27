
module.exports = function validate(hook, next) {

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

  if (!valid) return next(new errors.BadRequest(error))
  next()
}
