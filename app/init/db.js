
var config = require('config')
var db = require('mongo-promise')
db.url = process.env.MONGOLAB_URI || config.database.url
