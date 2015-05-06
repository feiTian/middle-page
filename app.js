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


var server = app.listen(9000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

})