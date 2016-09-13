module.exports = function api(seneca, io) {
  'use strict'

  var router = require('express').Router()

  // póst a bid
  router.post('/auction/:id/placeBid', (request, response) => {

    seneca.act('role:auction,cmd:placeBid', {
      auctionId: request.params.id,
      clientId: request.body.clientId,
      value: request.body.value
    }, (err, highestBid) => {

      if (err)
        response.error(err)

      response.json(highestBid)

      // emit to all connected sockets that a bid was made
      io.emit('highest-bid', highestBid)
    })
  })

  // get details from auction
  router.get('/auction/:id', (request, response) => {

    seneca.act('role:auction,cmd:details', {
      id: request.params.id
    }, (err, auction) => {

      if (err)
        response.error(err)

      response.json(auction)
    })
  })

  return router
}
