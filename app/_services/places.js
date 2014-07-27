
var db = require('mongo-promise')
var _ = require('lodash')

var base = require('./base')

db.shortcut('places')

module.exports = _.extend({}, base, {
  collection: db.places,
  validate: function(place) {

    var errors = {}

    if (!place.name) this.recordError(errors, 'name', 'Requires name')

    return _.isEmpty(errors) ? this.pass() : this.fail(errors)
  }
})
