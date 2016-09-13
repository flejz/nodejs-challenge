require('seneca')({
    log: 'silent'
  })
  .use('basic')
  .use('entity')
  .use('../modules/product')
  .listen({
    port: 4000
  })
