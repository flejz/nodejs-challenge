module.exports = function product(options) {
  'use strict'

  // gets the product by id
  this.add('role:product,cmd:get', (request, respond) => {

    if (!request.id) {
      return respond(new Error('Product id was not informed'))
    }

    // query product via entity
    this.make('product').load$(request.id, (err, product) => {

      respond(err, product)
    })

  })

  // gets all the products
  this.add('role:product,cmd:all', (request, respond) => {

    // gets all the products - no filter
    this.make('product').list$((err, list) => {

      respond(err, list)
    })
  })
}
