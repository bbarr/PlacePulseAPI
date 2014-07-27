
var cookieParser = require('cookie-parser')
var cookieSession = require('cookie-session')
var passport = require('passport')

module.exports = function(server) {
  server.use(cookieParser('foo'))
  server.use(cookieSession({ secret: 'foo' }))
  server.use(passport.initialize())
  server.use(passport.session())
}
