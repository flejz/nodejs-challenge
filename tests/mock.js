module.exports = function(seneca, options) {

  var clients = [{
    name: 'Jaime Flores',
    username: 'jaimelopesflores',
    country: 'Brazil'
  }, {
    name: 'Anna Losch',
    username: 'annalos',
    country: 'Germany'
  }, {
    name: 'Fabíola Figueroa',
    username: 'fabifigue',
    country: 'Chile'
  }]

  // Mocking product
  function _mockProduct() {

    return new Promise((resolve, reject) => {
      var prod = seneca.make$('product')
      prod.name = 'Rolex Day-Date'
      prod.description =
        'Very good condition with minimal traces of wear'
      prod.picture_path =
        'https://d2c2dsgt13elzw.cloudfront.net/resources/630x473/d3/eb/6450-9b35-4d63-8f10-8a84872b6b74.jpg'

      prod.save$((err, obj) => {
        if (err)
          reject(err)
        resolve(obj)

      })
    })
  }

  function _mockAuction(auctionId, prod) {
    return new Promise((resolve, reject) => {
      var auction = seneca.make('auction')
      auction.id = auctionId
      auction.name = 'Rolex Auction'
      auction.product_id = prod.id
      auction.starting_price = 200

      auction.save$((err, obj) => {
        if (err)
          reject(err)
        resolve(obj)
      })
    })
  }

  // Mock client
  function _mockClient(cli) {
    return new Promise(function(resolve, reject) {

      var client = seneca.make('client')
      client.name = cli.name
      client.username = cli.username
      client.country = cli.country

      if (cli.name == 'Jaime Flores')
        client.id = 'me'

      client.save$(function(err, obj) {
        if (err)
          reject(err)
        resolve(obj)
      })
    })
  }

  // Mock all the clients
  function _mockClients() {
    return new Promise((resolve, reject) => {
      var promise = []
      clients.forEach(cli => {
        promise.push(_mockClient(cli))
      })

      Promise.all(promise).then(clis => {
        resolve(clients = clis)
      })
    })
  }

  // Mocks bids
  function _mockBidsFromClients(auction, clients) {

    var bids = [990, 960.50]

    return new Promise((resolve, reject) => {

      var bid1 = seneca.make('bid')
      bid1.auction_id = auction.id
      bid1.client_id = clients[1].id
      bid1.value = bids[0]
      bid1.save$()

      var bid2 = seneca.make('bid')
      bid2.auction_id = auction.id
      bid2.client_id = clients[2].id
      bid2.value = bids[1]
      bid2.save$()

      resolve(bids[0])
    })
  }

  return {
    me: () => clients[0],
    client: () => {

      return new Promise((resolve, reject) => {

        seneca.ready(() => {

          _mockClients().then(clients => {

            resolve(clients)
          })
        })
      })
    },
    bid: (auction, clients) => {

      return new Promise((resolve, reject) => {

        seneca.ready(() => {

          _mockBidsFromClients(auction, clients).then(highestValue => {

            resolve(highestValue)
          })
        })
      })
    },
    product: () => {

      return new Promise((resolve, reject) => {

        seneca.ready(() => {

          _mockProduct().then(prod => {

            resolve(prod)
          })
        })
      })
    },
    all: () => {
      return new Promise((resolve, reject) => {

        seneca.ready(() => {

          _mockProduct().then(prod => {

            _mockAuction(options.auctionSingleBidderId, prod).then(
              auctionSingle => {

                _mockAuction(options.auctionMultipleBiddersId,
                  prod).then(auctionMultiple => {

                  _mockClients().then(clis => {

                    _mockBidsFromClients(
                      auctionMultiple, clients).then(
                      bids => {

                        resolve()
                      })
                  })
                })
              })
          })
        })
      })
    }
  }
}
