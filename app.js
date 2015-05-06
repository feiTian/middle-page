var express = require('express')
  , bodyParser = require('body-parser')
  , routes = require('./routes')
  , user = require('./routes/user')
  , userRequest = require('./routes/userRequest')
  , restaurant = require('./routes/restaurant');

var app = express()


// Setup header, for initial debugging
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('X-Powered-By','3.2.1');
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
}

app.use(allowCrossDomain);
app.use('/', express.static(__dirname + '/public'));
app.use(bodyParser.json());

//*****user routes
app.post('/user', user.doLogin);
app.post('/code', user.fetchCode_res);

//*****user request routes
app.post('/userRequest', userRequest.createUserRequest);
app.get( '/userRequest/:id/offer', userRequest.getOfferList);
app.post('/userRequest/:id/offerTaken', userRequest.takeOffer);
app.post('/userRequest/:id/offerConfirmation', userRequest.confirmOffer);

//*****restaurant routes
app.get('/restaurant', restaurant.getNearbyRestaurant);
app.get('/restaurant/:restaurantID/menu', restaurant.getMenuList);
app.post('/restaurant/register', restaurant.register);

var server = app.listen(9000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

})