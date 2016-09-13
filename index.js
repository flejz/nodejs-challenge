const express = require('express')
const app = express()
const server = require('http').createServer(app)
const config = require('./config')
const io = require('socket.io')(server)
const bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// Microservices toolkit
const seneca = require('seneca')({
    log: 'silent'
  })
  .use('basic')
  .use('entity')
  .use('./modules/product')
  .use('./modules/client')
  .use('./modules/bid')
  .use('./modules/auction')

// Api expose
const apiAuction = require('./api/auction')(seneca, io)
app.use('/api', apiAuction)

// View engine
app.set('view engine', 'jade')
app.set('views', './views')

// Routes
const auctionRouter = require('./routes/auction')(seneca)
app.use('/auction', auctionRouter)
app.get('/', (request, response) => {
  response.redirect('/auction/auctionWatch')
})

// Static paths
app.use(express.static(__dirname + '/public'))

// When a socket connect
io.on('connection', (socket) => {

  console.log('Someone is connected.')
})

// Demo purpose
const mock = require('./tests/mock')(seneca, {
  auctionSingleBidderId: 'auctionWatchSingle',
  auctionMultipleBiddersId: 'auctionWatch',
  clientId: 'me'
});

mock.all().then(() => {

  console.log('> app running on port:', config.port)
  server.listen(config.port)
})
