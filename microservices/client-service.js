require('seneca')({
    log: 'silent'
  })
  .use('basic')
  .use('entity')
  .use('../modules/client')
  .listen({
    port: 4001
  })
