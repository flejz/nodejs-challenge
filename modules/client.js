module.exports = function client(options) {
  'use strict'

  // gets the client by id
  this.add('role:client,cmd:get', (request, respond) => {

    if (!request.id) {
      return respond(new Error('Client id was not informed'))
    }

    // query client via entity
    this.make('client').load$(request.id, (err, client) => {

      respond(err, client)
    })

  })

  // gets all the clients
  this.add('role:client,cmd:all', (request, respond) => {

    // gets all the products - no filter
    this.make('client').list$((err, list) => {

      respond(err, list)
    })
  })
}
