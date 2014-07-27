
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var Parse = require('parse').Parse

Parse.initialize("tVy7Yv9Gk1eF6gikCxKbYduLoW5y1dRpzQgg3Fp2", "iExauSeKm5ZPnVA0PZlCk8SkeKu4IzTp73jdDjIt")

passport.serializeUser(function(user, done) {
  done(null, user._sessionToken)
})

passport.deserializeUser(function(token, done) {
  Parse.User.become(token).then(function(user) {
    done(null, user)
  }, function(err) {
    done(err)
  })
})

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(email, password, done) {
    Parse.User.logIn(email, password).then(function(user) {
      return done(null, user)
    }, function(e) {
      return done(e)
    }) 
  })
)
