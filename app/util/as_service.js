
var express = require('express')

module.exports = function(obj) {

  var router = express.Router()

  router.get('/', function(req, res) {
    obj.find(req.query).then(function(found) {
      if (found) res.send(found)
      else res.send(404)
    }, function(e) {
      res.send(500)
    })
  })

  router.get('/:id', function(req, res) {
    obj.get(req.params.id).then(function(got) {
      if (got) res.send(got)
      else res.send(404)
    }, function(e) {
      res.send(500)
    })
  })

  router.post('/', function(req, res) {
    obj.create(req.body).then(function(created) {
      res.send(201, created)
    }, function(e) {
      var code = e.errors ? 401 : 500
      res.send(code, e)
    })
  })

  router.put('/:id', function(req, res) {
  })

  return router
}
