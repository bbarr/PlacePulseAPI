
var feathers = require('feathers')
var hooks = require('feathers-hooks')
var bodyParser = require('body-parser')
var cors = require('cors')

var server = feathers()

require('./init/db')
require('./init/passport')
require('./init/sessions')(server)

var placeService = require('./services/places')
var tourService = require('./services/tours')
var userService = require('./services/users')

server
  .use(cors({ 
    credentials: true,
    origin: function(origin, cb) { cb(null, true) }
  }))
  .use(bodyParser.json())
  .configure(hooks())
  .configure(feathers.rest())
  .use('/places', placeService)
  .use('/tours', tourService)
  .use('/users', userService)
  .configure(feathers.errors())

module.exports = server
