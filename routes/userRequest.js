/*
	#createUserRequest
	#getOfferList
	#takeOffer
	#offerConfirmation
*/

mysql = require('mysql');
request = require('request');
var pool  = require('./db').pool;

exports.AdRequest = function(req, res){
	console.log("AdRequest");
	console.log(req.body);
	try{
		var query = {
					  "device": {
					    "did": "09fc4c589a4e03779f1935518c3df2a7",
					    "dpid": "c7299603f205f356b66625fb62b3a995",
					    "ip": "202.165.28.29",
					    "make": "Apple",
					    "model": "Iphone 5s",
					    "os": "ios",
					    "osv": "ios 7.0.1"
					  },
					  "browser": {
					    
					  },
					  "imp": [
					    {
					      "h": 120,
					      "impid": "08604401000010009",
					      "pos": 1,
					      "w": 640
					    }
					  ],
					  "requestid": "b6b01bcb5c2d4421c58718a680466422",
					  "userid": "904436969",
					  "phonetype": "1"
					};
		request.post(
				{
					url: 'http://124.207.207.26:8080/RTB/rest/adrequest',
					method: 'POST',
					json: req.body
				},
				function (error, response, body) {
					if (!error && response.statusCode == 200) {

						console.log('Get Ad successful');
						console.log(body);
						res.contentType('json');
						res.send(JSON.stringify(body.adresponse));
						res.end();
					} else {
						console.log('Get Ad Failed');
						console.log(error);
						res.contentType('json');
						res.status(401);
						res.send(JSON.stringify({status:"error."}));
						res.end();
					}
				}

		);
	}catch(e){
		console.log(e);
	}
};