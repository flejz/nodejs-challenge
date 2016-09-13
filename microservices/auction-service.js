require('seneca')({
    log: 'silent'
  })
  .use('basic')
  .use('entity')
  .client({
    port: 4000
  })
  .client({
    port: 4001
  })
  .client({
    port: 4002
  })
  .use('../modules/auction')
  .listen({
    port: 4003
  })
