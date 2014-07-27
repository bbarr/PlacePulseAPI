
module.exports = {
  type: 'object',
  properties: {
    name: {
      type: 'string'
    },
    places: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: {
            type: 'string'
          }
        },
        required: [ 'name' ]
      }
    }
  },
  required: [ 'name', 'places' ]
}
