module.exports = function bid() {
  'use strict'

  // adds a bid
  this.add('role:bid,cmd:add', (request, respond) => {

    if (!request.auctionId) {
      return respond(new Error('Auction id was not informed'))
    } else if (!request.clientId) {
      return respond(new Error('Client id was not informed'))
    } else if (!request.value) {
      return respond(new Error('Value was not informed'))
    }

    var bid = this.make('bid')
    bid.auction_id = request.auctionId
    bid.client_id = request.clientId
    bid.value = request.value

    bid.save$((err, bid) => {
      respond(err, bid)
    })
  })

  // gets all the bids of an auction
  this.add('role:bid,cmd:all', (request, respond) => {

    if (!request.auctionId) {
      return respond(new Error('Auction id was not informed'))
    }

    // create the query
    let query = {
      auction_id: request.auctionId,
      sort$: {
        value: -1
      }
    }

    if (request.clientId)
      query.client_id = request.clientId

    // query bid via entity
    this.make('bid').list$(query, (err, bids) => {

      respond(err, bids)
    })

  })

  // gets the highest bid by auction
  this.add('role:bid,cmd:highest', (request, respond) => {

    if (!request.auctionId) {
      return respond(new Error('Auction id was not informed'))
    }

    // create the query
    let query = {
      auction_id: request.auctionId,
      sort$: {
        value: -1
      },
      limit$: 1
    }

    if (request.clientId)
      query.client_id = request.clientId

    // query bid via entity
    this.make('bid').list$(query, (err, bids) => {

      if (err) {
        return respond(err)
      } else if (bids.length > 1) {
        return respond(new Error('More than one highest bid'))
      } else if (bids.length == 0){
        return respond(null, null)
      }

      this.act('role:client,cmd:get', {
        id: bids[0].client_id
      }, (err, client) => {

        bids[0].client = client

        respond(err, bids[0])

      })
    })
  })

}
