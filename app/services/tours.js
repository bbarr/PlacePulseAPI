
var service = require('feathers-mongodb')
var errors = require('feathers').errors.types
var helpers = require('../util/service_helpers')
var schema = require('../schemas/tour')
var tv4 = require('tv4')
var _ = require('lodash')
var config = require('config')

var validate = helpers.validator(schema)

var tourService = service({
  connectionString: helpers.connectionString,
  collection: 'tours'
})

tourService.before = {
  create: [ validate ],
  update: [ validate ],
  patch: [ validate ]
}

module.exports = tourService
