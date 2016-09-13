const assert = require('assert');
const seneca = require('seneca')({
    log: 'silent'
  })
  .use('basic')
  .use('entity')
  .use('../../modules/product')
  .use('../../modules/client')
  .use('../../modules/bid')
  .use('../../modules/auction')

var options = {
  auctionSingleBidderId: 'auctionTest1',
  auctionMultipleBiddersId: 'auctionTest2'
}

const mock = require('../mock')(seneca, options);

before((done) => {
  mock.all().then(done)
});

describe('when request all auctions', () => {

  it('should return a list of auctions', (done) => {

    seneca.act('role:auction,cmd:all', (err, auctions) => {

      if (err)
        done(err)

      assert.ok(typeof auctions === 'object' && auctions.length !=
        undefined)
      done()
    })
  })
})

describe('when request an auction by id', () => {

  it('should return the auction details', (done) => {

    seneca.act('role:auction,cmd:details', {
      id: options.auctionMultipleBiddersId
    }, (err, auction) => {

      if (err)
        done(err)

      assert.ok(auction)
      done()
    })
  })

  describe('and do not inform the auction id', () => {

    it('should return an error', (done) => {

      seneca.act('role:auction,cmd:details', (err, auction) => {

        assert.ok(err)
        assert.ok(!auction)
        done()
      })
    })
  });
});
