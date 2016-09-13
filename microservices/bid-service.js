require('seneca')({
    log: 'silent'
  })
  .use('basic')
  .use('entity')
  .client({
    port: 4001
  })
  .use('../modules/bid')
  .listen({
    port: 4002
  })
