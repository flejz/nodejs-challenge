module.exports = function auction() {
  'use strict'

  // places a bid
  this.add('role:auction,cmd:placeBid', (request, respond) => {

    this.act('role:bid,cmd:add', {
      auctionId: request.auctionId,
      clientId: request.clientId,
      value: request.value
    }, (err, bid) => {

      if (err)
        respond(err)

      this.act('role:bid,cmd:highest', {
        auctionId: request.auctionId
      }, (err, bid) => {

        respond(err, bid)
      })
    })
  })

  // gets the details of an auction
  this.add('role:auction,cmd:details', (request, respond) => {

    if (!request.id) {
      return respond(new Error('Auction id was not informed'))
    }
    // request the auction room by id
    this.make$('auction').load$(request.id, (err, auction) => {

      if (err) {
        return respond(err)
      } else if (!auction) {
        return respond(null, null)
      }

      // gets the product from the auction
      this.act('role:product,cmd:get', {
        id: auction.product_id
      }, (err, product) => {

        if (err) {
          return respond(err)
        }

        this.act('role:bid,cmd:highest', {
          auctionId: auction.id
        }, (err, bid) => {

          if (err) {
            return respond(err)
          }

          auction.product = product
          if (bid)
            auction.highestBid = bid

          respond(null, auction)
        })
      })
    })
  })

  // gets all the products
  this.add('role:auction,cmd:all', (request, respond) => {

    // gets all the products - no filter
    this.make('auction').list$((err, list) => {

      respond(err, list)
    })
  })
}
