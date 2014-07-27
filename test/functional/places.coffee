
console.log(require('config'))
expect = require('expect.js')
server = require('../../app/server')
test = require('supertest')

db = require('mongo-promise')

describe '/places', ->

  afterEach (done) ->
    db.shortcut('places')
    db.places.find().then (places) ->
      if (places.length)
        db.places.drop().then(done)
      else
        done()

  describe 'find', ->

    it 'should return empty array if no places match', (done) ->
      test(server).get('/places')
        .expect([])
        .end(done)

    it 'should return a match', (done) ->
      db.places.insert({ name: 'some place' }).then (places) ->
        test(server).get('/places')
          .set('Accept', 'application/json')
          .expect(JSON.stringify(places))
          .end(done)

  describe 'get', ->
    
    it 'should return 404 if not found', (done) ->
      test(server).get('/places/53d057391266c4454c0dee0a')
        .expect(404)
        .end(done)

    it 'should return a place by id', (done) ->
      db.places.insert({ name: 'foo' }).then (places) ->
        place = places[0]
        test(server).get("/places/#{place._id}")
          .expect(JSON.stringify(place))
          .end(done)

  describe 'create', ->

    it 'should create a valid place', (done) ->
      test(server).post('/places').send({ name: 'foo', description: 'bar' })
        .expect(201)
        .expect((res) ->
          return 'created place was not returned' unless res.body.name is 'foo'
        ).end(done)

    it 'should give 400 and errors if its a poorly formatted place', (done) ->
      test(server).post('/places').send({ name: 'blah' })
        .set('Accept', 'application/json')
        .expect(400)
        .end(done)

  describe 'update', ->

    it 'should update with a valid place', (done) ->
      db.places.insert({ name: 'foo', description: 'bar' }).then (places) ->
        place = places[0]
        test(server).put("/places/#{place._id}").send({ name: 'bar', description: 'bar' })
          .expect(200)
          .expect((res) ->
            return 'updated place was not updated' unless res.body.name is 'bar'
          ).end(done)

    it 'should give 400 and errors if given a poorly formatted place', (done) ->
      db.places.insert({ name: 'foo', description: 'bar' }).then (places) ->
        place = places[0]
        test(server).put("/places/#{place._id}").send({ foo: 'bar' })
          .set('Accept', 'application/json')
          .expect(400)
          .end(done)

  describe 'patch', ->

    it 'should update with a valid patch', (done) ->
      db.places.insert({ name: 'foo', description: 'bar' }).then (places) ->
        place = places[0]
        test(server).patch("/places/#{place._id}").send({ name: 'bar', foo: 'bar' })
          .expect(200)
          .expect((res) ->
            return 'updated place was not updated' unless res.body.name is 'bar' and res.body.foo is 'bar'
          ).end(done)

    it 'should give 400 and errors if given a poorly formatted place', (done) ->
      db.places.insert({ name: 'foo', description: 'bar' }).then (places) ->
        place = places[0]
        test(server).patch("/places/#{place._id}").send({ name: 'bar', description: 4 })
          .set('Accept', 'application/json')
          .expect(400)
          .end(done)

  describe 'remove', ->

    it 'should remove by id', (done) ->
      db.places.insert({ name: 'foo' }).then (places) ->
        place = places[0]
        test(server).del("/places/#{place._id}")
          .expect(200)
          .end(done)

    it 'should 404 if missing', (done) ->
      test(server).del("/places/1")
        .expect(404)
        .end(done)

