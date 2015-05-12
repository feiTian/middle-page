var express = require('express')
  , bodyParser = require('body-parser')
  , userRequest = require('./routes/userRequest')

var app = express()


// Setup header, for initial debugging
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

app.use(allowCrossDomain);
app.use('/', express.static(__dirname + '/public'));
app.use(bodyParser.json());


app.post('/AdRequest', userRequest.AdRequest);
app.post('/getHongbao', userRequest.getHongbao);


var server = app.listen(9000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

})