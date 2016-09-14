# Challenge Considerations

First thanks for the opportunity. It was such a great challenge!
In this document I will make some considerations about the solution and the approach I have chosen.
To handle this task I took little more than 8 hours, from the tests and the back-end implementation to the simple front-end. To achieve this number I have made some researches and study before start coding, so I was able to define the scope to fit the 8 hours requirement. These researches and studies time are not accounted in the total hours, neither the time I spent to write this document.
I focused my solution in back-end development, the core of a modern web application.
I based my solution in a microservice architecture powered by seneca.js microservices toolkit.
The source code can be downloaded from the github repository:

https://github.com/jaimelopesflores/nodejs-challenge

Detailed information follows below.

## Development Environment

```
Node.js version: v6.5.0
npm version: 3.10.3
OS Linux Mint 18 Sarah
```

## Solution Architecture

The back-end is powered by express.js and uses seneca.js to handle all the business and persistence operations.
The reason I choose seneca.js is because it offers a great technology and functionality stack to a microservices architecture. You can listen multiple copies of the same microservices from different types of protocols, and you can even do the load balancing between the microservices. All in the software layer.

In this application I am not using the microservices that seneca.js provides because it would demand a lot of time to prepare the test environment. I am using all the modularization and persistence although, and have all the structure prepared to a microservice architecture. Samples of how it should work can be found in the folder microservices.

I decided not to use a code generator as an express generator or comet.js for example.
I used TDD methodology to develop this challenge.

### Entities
According to the scenarios I have defined 4 entities to my application.

* **Product**: Have the product name, description and picture path.
* **Client**: Name, username and country.
* **Auction**: Have a direct product relation, the minimum bid allowed and the name of the auction.
* **Bid**: Relation to the auction and the client, to store que client bids in a determined auction.

So the tests, modules and microservices are coded based in these 4 entities.

### Modules
The folder modules have the implementation of the business and persistence layer.
Each module follows the seneca.js module concept, adding specific functionalities to the main seneca instance, for example a piece of implementation of the module product:
```javascript
module.exports = function product(){
this.add(‘role:product,cmd:get’, (data, respond) => { … })
}
```
Adding its functionalities to the main seneca instance:
```javascript
require(‘seneca’)().use(‘../path_to_modules/product’)
```
Obs: The context in the module is the context of seneca when using the module.
So, you can concatenate modules (or the modules as microservices) to have any business logic. For example the module auction requires all the other modules to work properly.

### Microservices
Expose the modules as services. For example if you want to expose module product as a microservice via tcp protocol you should write this code.
```javascript
require('seneca')()
  .use('../path_to_modules/product')
  .listen({ type: ‘tcp’, pin:’role:product’ })
```
Then, in the auction module you can consume this microservice instead using the product module directly.
```javascript
require('seneca')()
  .client({ type: ‘tcp’, pin:’role:product’ })
  .use('../path_to_modules/auction')
  .listen({ type: ‘tcp’, pin:’role:auction })
```
Obs¹: In this sample, the module auction requires the module or microservice product to work properly.
Obs²: The pin attribute is an identifier to the tcp protocol.
The solution does not use the microservices architecture, it loads modules directly.

### API
Exposes the auction module main functionalities:

* /api/auction/:id - GET the auction by :id
* /api/auction/:id/placeBid - POST a bid to the auction by :id, passing the client id and the value in the body request.

The placeBid method is used in the front-end application.

### Others
* Common folders and files.
* Routes: The Node.js auction router file.
* Views: Jade formatted files.
* Public: Static content to views.
* Index.js: Main application file.
* Config.js: Store the port the app gonna run.

## Data/Database

This application use an in-memory data store for tests and demo purpose.
Seneca have multiple other data-stores plugins, such as redis, mongodb, mysql, etc.

In a microservice structure my choice would be an no-sql database as a service. I would prefer this approach for the guarantee of high availability and performance.

The data mock for the tests and running application are the same. The mock file can be found in ./tests/mock.js.
## Security
In this solution I did not implement any kind of security layer.
Seneca allows us to import authentication modules from its plugin library (the famous passport.js, for example) or even write custom security modules ourselves.
## Tests
This application was designed using TDD methodology.
Only the required test scenarios are implemented to run the application. For example, the tests do not handle unknown registers, so all the tests are made expecting existing registers.

We are testing in our application some scenarios in the module integration test and also some unit capabilities of the modules.
To write the tests only seneca.js and native assert were needed.
Tests runs using mocha library. To run the tests just type:

```
npm test
```
or
```
mocha tests/**/**
```
Obs: be sure to have all dev-dependencies installed before running the tests. Run npm install to have sure.

## Front-end
A simple front-end was developed with the purpose of showing the auction/product information, the greatest bid and gives the possibility to the user place a bid.
Styled in simple bootstrap and using the old-but-good jQuery to manage the DOM.

## Running Solution
Git clone the application and enter the cloned folder.
```
git clone git@github.com:jaimelopesflores/nodejs-challenge.git
cd nodejs-challenge
```
Install the Node.js packages and then run the local server (port 3000 by default)
```
npm install
npm start
```
In the browser, to see the auction details type:

http://localhost:3000/auction/auctionWatch

To get the auction details via api, type:

http://localhost:3000/api/auction/auctionWatch

Even when you place a bid, the server will return the auction highest bid, even if the bid is not yours. If you place the highest bid, the bid shown will be your bid.
Obs: To reset the in-memory database just stop and run again the Node.js server.


## Real-time Auction
This solution also recognize when a bid is made, and after the bid evaluation and persistence, the server emit the highest bid of the auction to all the connected attendees via websocket using socket.io.

Try open more than one web page browser in the link below (even across the network) and place a bid greater than $ 1000.

http://localhost:3000/auction/auctionWatch

## Final Conclusion
I know that some essential non-functional requirements are not implemented (security protocols, real database, end to end basic tests, for example).
I preferred just comment about these topics and not to implement because i know they are not tasks that can be made without a lot of study, modeling and tons of tests.
As I said before, they are essential to Auctionata business.
Any questions and doubts please let me know.





**Jaime Flores**
