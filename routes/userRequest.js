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
var mongodb = require('./mongo-lib/mongodb');
var UserlogModel = mongodb.UserlogModel;

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

function addUserlog(inst) {
    console.log("add user");
    
    /*var instance = new UserlogModel(json);
    instance.save(function(err){
        console.log("error: " + err);
    })*/
	//updateUserlog(json, newlog);
};

function updateUserlog(ul, newlog){
	console.log("update userlog");
    UserlogModel.findOneAndUpdate(
        {mobile: ul.mobile},
        {
        	$set: {
        		name: ul.name,
        		mobile: ul.mobile,
        		email: ul.email
        	},

            $push: {
                liuliang: newlog
            }

        },
        {
            upsert: true
        },
        function (err, deal) {
            if (err) {
                console.log('update user: ' + err);
            }
            console.log('updated a user');
            giveHongbao(ul, newlog);
        });
}

function hasToday(ul, newlog, callback){
	UserlogModel.find(
		{mobile: ul.mobile, 'liuliang.lltime': newlog.lltime},
		function(err, res){
			if(res.length > 0){
				console.log("exists.");
				callback(false);
			}else{
				console.log("not exists");
				updateUserlog(ul, newlog);
				callback(true);
			}
		});
}

function giveHongbao(ul, newlog){
	var cip_r = Encry2("mobile=18688599256");
	console.log("cip_r is: " + cip_r);
	var baseurl = 'http://fx.17wo.cn/external/auth/AuthCenterGetJsessionidByMobile/WestTower?u=';
	var req_url = baseurl + cip_r;
	try{
		request.get(req_url, function (error, response, body) {
			try{
			  //if (!error && response.statusCode == 200) {
			  	var r = JSON.parse(body);
			  	console.log(body);
			    console.log(r);
			    console.log(r.result.properties.jsessionid); 

			   	var jessionid = decodeURIComponent(r.result.properties.jsessionid);
				var param = "jsessionid="+jessionid + ";receiveMobile=18688599256;value=1";

			}catch(e){

			}
		  //}
		});
	}catch(e){

	}

	fs.open('public/log.txt', 'a', function(e, fd){
		if(e)
			throw e;
		var l = moment().format('YYYY-MM-DD HH:mm:ss') + " " + ul.mobile + ' ' + newlog.ad_id + "\r\n";
		console.log(l);
		fs.write(fd, l, 0, 'utf8', function(e){
			if(e)
				throw e;
			fs.closeSync(fd);
		})
	})
}

exports.getHongbao = function(req, res){
	console.log("getHongbao");
    var ul = {
        name: "test",
        mobile: req.body.phonenumber,
        email:""
    };
    var newlog = {
    	ad_id: req.body.ad_id,
    	llnumber: 1,
    	lltime: moment().format('YYYY-MM-DD')
    }
    console.log(ul);
    console.log(newlog);
	hasToday(ul, newlog, function(giveOrnot){
		if(giveOrnot){
			//give hongbao
			res.contentType('json');
			res.send(JSON.stringify({ status:"return hongbao.", code: 1}));
			res.end();
		}else{
			//not give honbgao
			res.contentType('json');
			res.send(JSON.stringify({ status:"return no hongbao.", code: 0}));
			res.end();
		}
	});
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