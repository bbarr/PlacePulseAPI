
var _ = require('lodash')
var rsvp = require('rsvp')
var feathers = require('feathers')

function errorResponse(type, details) {
  var e = new Error
  e.errors = details
  return fail(new feathers.errors.types[type](e))
}

function pass(x) {
  return new rsvp.Promise(function(res, rej) { return res(x) })
}

function fail(x) {
  return new rsvp.Promise(function(res, rej) { return rej(x) })
}

module.exports = {

  validate: function() { return pass() },
  fail: fail,
  pass: pass,
  errorResponse: errorResponse,
  recordError: function(errors, key, val) {
    (errors[key] || (errors[key] = [])).push(val)
  },

  find: function(params) {
    return this.collection.find(params.query)
  },

  get: function(id, opts) {
    return this.collection.findById(id).then(function(obj) {
      return obj ? obj : errorResponse('NotFound')
    })
  },

  create: function(data, opts) {
    return this.validate(data).then(function() {
      return this.collection.insert(data).then(_.first)
    }.bind(this), function(e) {
      return errorResponse('BadRequest', e)
    })
  },

  update: function(id, data, opts) {
    return this.validate(data).then(function() {
      return this.collection.update({ _id: id }, data, opts).then(function(obj) {
        return obj
      }.bind(this), function(e) {
        return errorResponse('NotFound', e)
      })
    }.bind(this), function(e) {
      return errorResponse('BadRequest', e)
    })
  },
  
  patch: function(id, data, opts) {
    return this.collection.findById(id).then(function(old) {
      var patched = _.extend(old, data)
      return this.validate(patched).then(function() {
        return this.collection.update({ _id: id }, patched, opts)
      }.bind(this), function(e) {
        return errorResponse('BadRequest', e)
      })
    }.bind(this), function(e) {
      return errorResponse('NotFound', e)
    })
  },

  remove: function(id, opts) {
    return this.collection.remove({ _id: id }, opts).then(function(obj) {
      return id
    }, function(e) {
      return errorResponse('NotFound', e)
    })
  },

  setup: function(app) {}
}
