const assert = require('assert');
const seneca = require('seneca')({
    log: 'silent'
  })
  .use('basic')
  .use('entity')
  .use('../../modules/client')
  .use('../../modules/bid')

const mock = require('../mock')(seneca);
var auctionId = 'bidTestAuctionId'
var clientId = 'bidTestClientId'
var bidHighestValue = null;

before((done) => {
  mock.bid({
    id: auctionId
  }, [null, {
    id: clientId
  }, {
    id: clientId
  }]).then((highValue) => {
    bidHighestValue = highValue
    done()
  })
});


describe('when add a bid', () => {

  it('should return itself', (done) => {

    seneca.act('role:bid,cmd:add', {
      auctionId: auctionId,
      clientId: clientId,
      value: 200
    }, (err, bid) => {

      if (err)
        done(err)

      assert.ok(bid)
      done()
    })
  })

  describe('with no auction, client or value', () => {

    it('should return an error', (done) => {
      seneca.act('role:bid,cmd:add', (err, bid) => {

        assert.ok(err)
        assert.ok(!bid)
        done()
      })
    });
  })
})

describe('when request all the bids of an auction', () => {

  it('should return a list of bids', (done) => {

    seneca.act('role:bid,cmd:all', {
      auctionId: auctionId
    }, (err, bids) => {

      if (err)
        done(err)

      assert.ok(typeof bids === 'object' && bids.length !=
        undefined)
      done()
    })
  })

  describe('and do not inform the auction id', () => {

    it('should return an error', (done) => {

        seneca.act('role:bid,cmd:highest', (err, bid) => {

          assert.ok(err)
          assert.ok(!bid)
          done()
        })
      }) // body...
  })
})

describe('when request all the bids of a client', () => {

  it('should return a list of bids', (done) => {

    seneca.act('role:bid,cmd:all', {
      auctionId: auctionId,
      clientId: clientId
    }, (err, bids) => {

      if (err)
        done(err)

      assert.ok(typeof bids === 'object' && bids.length !=
        undefined)
      done()
    })
  })

  describe('and do not inform the auction id', () => {

    it('should return an error', (done) => {

        seneca.act('role:bid,cmd:all', {
          clientId: clientId
        }, (err, bid) => {

          assert.ok(err)
          assert.ok(!bid)
          done()
        })
      }) // body...
  })
})

describe('when request the highest bid', () => {

  describe('of an auction', () => {

    it('should return the bid', (done) => {

      seneca.act('role:bid,cmd:highest', {
        auctionId: auctionId
      }, (err, bid) => {

        if (err)
          done(err)

        assert.ok(bid)
        assert.equal(bid.value, bidHighestValue)
        done()
      })
    })

    describe('and do not inform the auction id', () => {

      it('should return an error', (done) => {

        seneca.act('role:bid,cmd:highest', (err, bid) => {

          assert.ok(err)
          assert.ok(!bid)
          done()
        })
      })
    })
  })

  describe('of a client', () => {

    it('should return the bid', (done) => {

      seneca.act('role:bid,cmd:highest', {
        auctionId: auctionId,
        clientId: clientId
      }, (err, bid) => {

        if (err)
          done(err)

        assert.equal(bid.value, bidHighestValue)
        done()
      })
    })

    describe('and do not inform the auction id', () => {

      it('should return an error', (done) => {

        seneca.act('role:bid,cmd:highest', {
          clientId: clientId
        }, (err, bid) => {
          assert.ok(err)
          assert.ok(!bid)
          done()
        })
      })
    })
  })
})
