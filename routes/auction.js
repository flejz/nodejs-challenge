module.exports = function api(seneca) {
  'use strict'

  var router = require('express').Router()

  // get details from auction
  router.get('/:id', (request, response) => {

    seneca.act('role:auction,cmd:details', {
      id: request.params.id
    }, (err, auction) => {

      if (err)
        response.error(err)

      if (!auction)
        response.render('not-found')
      else
        response.render('auction', auction)
    })
  })

  return router
}
