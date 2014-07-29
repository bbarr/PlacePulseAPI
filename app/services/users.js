
var helpers = require('../util/service_helpers')
var Parse = require('parse')

var userService = {

  get: function(id, params) {

    if (params.currentUser.id !== id) return helpers.error('NotAuthenticated')

    var query = new Parse.Query(Parse.User)
    return query.get(id).then(function(user) {
      return user || helpers.error('NotFound')
    })
  },

  create: function(data, params) {

    var user = new Parse.User

    user.set("firstName", data.firstName)
    user.set("lastName", data.lastName)
    user.set("username", data.email)
    user.set("password", data.password)
    user.set("email", data.email)

    return user.save()
  },

  update: function(id, data, params) {

    if (params.currentUser.id !== id) return helpers.error('NotAuthenticated')

    var user = params.currentUser

    user.set('firstName', data.firstName)
    user.set('lastName', data.lastName)
    user.set('email', data.email)
    user.set('username', data.email)
    
    return user.save()
  },

  remove: function(id, params) {
    
    if (params.currentUser.id !== id) return helpers.error('NotAuthenticated')

    return params.currentUser.destroy()
  }
}

userService.before = {
  get: [ helpers.authenticate ],
  create: [ helpers.authenticate ],
  update: [ helpers.authenticate ],
  remove: [ helpers.authenticate ]
}

module.exports = userService
