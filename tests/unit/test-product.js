const assert = require('assert');
const seneca = require('seneca')({
    log: 'silent'
  })
  .use('basic')
  .use('entity')
  .use('../../modules/product')

const mock = require('../mock')(seneca);
var product = null;

before((done) => {
  mock.product().then((prod) => {
    product = prod
    done()
  })
});

describe('when request all products', () => {

  it('should return a list of products', (done) => {

    seneca.act('role:product,cmd:all', (err, products) => {

      if (err)
        done(err)

      assert.ok(typeof products === 'object' && products.length !=
        undefined)
      done()
    })
  })
})

describe('when request a product by id', () => {

  it('should return the product details', (done) => {

    seneca.act('role:product,cmd:get', {
      id: product.id
    }, (err, product) => {

      if (err)
        done(err)

      assert.ok(product)
      assert.ok(product.name)
      assert.ok(product.description)
      assert.ok(product.picture_path)
      done()
    })
  })

  describe('and do not pass the product id', () => {

    it('should return an error', (done) => {

      seneca.act('role:product,cmd:get', (err, product) => {

        assert.ok(err)
        assert.ok(!product)
        done()
      })
    })
  })
})
