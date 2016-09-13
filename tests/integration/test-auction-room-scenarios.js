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
  auctionSingleBidderId: 'integrationAuction1',
  auctionMultipleBiddersId: 'integrationAuction2'
}

const mock = require('../mock')(seneca, options);

before((done) => {
  mock.all().then(done)
});

describe('when i am in an auction room', () => {

  it('should show product details', (done) => {

    seneca.act('role:auction,cmd:details', {
      id: options.auctionMultipleBiddersId
    }, (err, auction) => {

      if (err)
        done(err)

      assert.ok(auction)
      assert.ok(auction.product)
      done();
    })

  });

  it('should show the highest bid', (done) => {

    seneca.act('role:auction,cmd:details', {
      id: options.auctionMultipleBiddersId
    }, (err, auction) => {

      if (err)
        done(err)

      assert.ok(auction)
      assert.ok(auction.highestBid)
      assert.ok(auction.highestBid.client)
      done();
    })
  });

  describe('and i am the only bidder', () => {

    describe('i place a bid', () => {

      describe('and my bid is the highest', () => {

        it('should show me as the highest bidder', (done) => {

          seneca.act('role:auction,cmd:placeBid', {
            auctionId: options.auctionSingleBidderId,
            clientId: mock.me().id,
            value: 1000
          }, (err, highestBid) => {

            if (err)
              done(err)

            assert.ok(highestBid)
            assert.equal(highestBid.client.id, mock.me()
              .id)
            done();
          })
        });
      });
    });
  });

  describe('and i am not the only bidder', () => {

    describe('i place a bid', () => {

      describe('and my bid is not the highest', () => {

        it('should not show me as the highest bidder', (done) => {

          seneca.act('role:auction,cmd:placeBid', {
            auctionId: options.auctionMultipleBiddersId,
            clientId: mock.me().id,
            value: 975
          }, (err, highestBid) => {

            if (err)
              done(err)

            assert.ok(highestBid)
            assert.notEqual(highestBid.client.id, mock.me()
              .id)
            done();
          })
        })
      })

      describe('and my bid is the highest', () => {

        it('should show me as the highest bidder', (done) => {

          seneca.act('role:auction,cmd:placeBid', {
            auctionId: options.auctionMultipleBiddersId,
            clientId: mock.me().id,
            value: 1000
          }, (err, highestBid) => {

            if (err)
              done(err)

            assert.ok(highestBid)
            assert.equal(highestBid.client.id, mock.me()
              .id)
            done();
          })

        });
      });
    })
  })
})
