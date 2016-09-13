const assert = require('assert');
const seneca = require('seneca')({
    log: 'silent'
  })
  .use('basic')
  .use('entity')
  .use('../../modules/client')

const mock = require('../mock')(seneca);
var clients = null;
var client;

before((done) => {
  mock.client().then((clis) => {
    clients = clis
    client = clis[0]
    done()
  })
});

describe('when request all clients', () => {

  it('should return a list of clients', (done) => {

    seneca.act('role:client,cmd:all', (err, clients) => {

      if (err)
        done(err)

      assert.ok(typeof clients === 'object' && clients.length !=
        undefined)
      done()
    })
  })
})

describe('when request a client by id', () => {

  it('should return the client details', (done) => {

    seneca.act('role:client,cmd:get', {
      id: client.id
    }, (err, client) => {

      if (err)
        done(err)

      assert.ok(client)
      assert.ok(client.name)
      assert.ok(client.username)
      assert.ok(client.country)
      done()
    })
  })

  describe('and do not pass the client id', () => {

    it('should return an error', (done) => {

      seneca.act('role:client,cmd:get', (err, client) => {

        assert.ok(err)
        assert.ok(!client)
        done()
      })
    })
  })
});
