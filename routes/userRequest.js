/*
	#createUserRequest
	#getOfferList
	#takeOffer
	#offerConfirmation
*/

mysql = require('mysql');
request = require('request');
fs = require('fs');
moment = require('moment');
assert = require('assert');
crypto = require('crypto');

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

exports.getHongbao = function(req, res){
	console.log("getHongbao");

	var cip_r = Encry2("mobile=18688599256");
	console.log("cip_r is: " + cip_r);
	var baseurl = 'http://fx.17wo.cn/external/auth/AuthCenterGetJsessionidByMobile/WestTower?u=';
	var req_url = baseurl + cip_r;
	request.get(req_url, function (error, response, body) {
	  //if (!error && response.statusCode == 200) {
	    console.log(error);
	    console.log(body); // Show the HTML for the Google homepage.
	    console.log(response); // Show the HTML for the Google homepage.
	  //}
	});
	

	var jessionid = decodeURIComponent('nng7gXELg9tXMOERn%2Bqqd8LstDatBs4Xo3IAYX%2BxMpZz4e36UAt1QnwXc2eawIfoSL75IdYdRwLHmCE69DQ7MD%2BNfGepdrv9rBtfI3raNz4%3D');
	var param = "jsessionid="+jessionid + ";receiveMobile=18688599256;value=1";


	console.log(req.body);

	fs.open('public/log.txt', 'a', function(e, fd){
		if(e)
			throw e;
		var l = moment().format('YYYY-MM-DD HH:mm:ss') + " " + req.body.phonenumber + ' ' + req.body.ad_id + "\r\n";
		console.log(l);
		fs.write(fd, l, 0, 'utf8', function(e){
			if(e)
				throw e;
			fs.closeSync(fd);
		})
	})

	res.contentType('json');
	res.send(JSON.stringify({ status:"return hongbao."}));
	res.end();
}

function Encry2(params){
	var key = new Buffer("Tn8s7UTBZ35bm6c6E       ");  
    var iv = new Buffer(8);
    var plaintext = params;
    var alg = 'des-ede3-cbc';  
    var autoPad = true;  
	for(var i = 0; i<8; i ++){
		iv[i] = null;
		console.log(iv[i]);
	}  
    //encrypt  
    var cipher = crypto.createCipheriv(alg, key, iv);  
    cipher.setAutoPadding(autoPad);  //default true  
    var ciph = cipher.update(plaintext, 'utf8', 'base64');  
    ciph += cipher.final('base64');  
    console.log(alg, encodeURIComponent(ciph));
    return encodeURIComponent(ciph);
}

function Encry(){
	console.log("encry");
	var SECRET_KEY = "Tn8s7UTBZ35bm6c6E       ";
	var ENCODING = 'base64';
	var text = "mobile=18688599256";
	var iv = new Buffer(8);
	for(var i = 0; i<8; i ++){
		iv[i] = null;
		console.log(iv[i]);
	}

	var cipher = crypto.createCipher('des-ede3-cbc', SECRET_KEY, iv);
	cipher.setAutoPadding(true);
	var cryptedPassword = cipher.update(text, 'utf8', ENCODING);
	cryptedPassword += cipher.final(ENCODING);
	var urlstring = encodeURIComponent(cryptedPassword);
	console.log("cryptedPassword : " + cryptedPassword);
	console.log("url : " + urlstring);
	 
	//var decipher = crypto.createDecipher('des-ede3-cbc', SECRET_KEY, iv);
	//var decryptedPassword = decipher.update(cryptedPassword, ENCODING, 'utf8');
	//decryptedPassword += decipher.final('utf8');
	 	 
	//console.log("Crypted Text:", cryptedPassword);
	//console.log("Decrypted Text:", decryptedPassword);
}