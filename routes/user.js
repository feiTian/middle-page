/*
 * GET users listing.
 */
mysql = require('mysql');
var pool  = require('./db').pool;

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.fetchCode = function(req, res){
	//Fetch sms code from sms server
	console.log("fetching code.");
	try{
		var smscode = (Math.random()*1000000).toFixed(0);
		var sms = '【为爱吃狂】欢迎使用为爱吃狂，您的手机验证码是' + smscode + '。本条信息无需回复';
		var request = require('request');
		console.log(sms);
		console.log(req.body.mobile);
		request.post(
			{
				url:'http://yunpian.com/v1/sms/send.json',
				form:{ apikey: "fda4d2127b5394a76d1562f91d7a304d", mobile: req.body.mobile, text: sms }}
				,function (error, response, body) {
				if (!error && response.statusCode == 200) {
					console.log('send sms successful');
					res.contentType('json');
					res.send(JSON.stringify({smscode:smscode}));
					res.end();
				} else {
					console.log('send sms Failed');
					console.log(error);
					res.contentType('json');
					res.status(401);
					res.send(JSON.stringify({status:"incorrect mobile number"}));
					res.end();
				}
			}
		);

		pool.query('insert into usersmsverification set userid = (select ID from users where Mobile= ? ), code = ? , CreatedTime = ?', [req.body.mobile, smscode, new Date()], function(err, results) {
		  if (results.affectedRows !== 0){
		  	console.log('add smscode ', results.affectedRows);
		  }
		  else
		    console.log('Error while performing Query.');
		});
	}catch(e){
		console.log(e);
	}
};

exports.doLogin = function(req, res){
	console.log("doLogin action");
	try{
		pool.query('SELECT * from usersmsverification, users where usersmsverification.UserId = users.ID and users.Mobile = ?  and usersmsverification.Code = ?', [req.body.mobile, req.body.smscode], function(err, rows, fields) {
		  if (!err){
		  	console.log('The solution is: ', rows.length);	  	

			if(rows.length !== 0 && req.body.mobile===rows[0].Mobile && req.body.smscode===rows[0].Code){
				console.log("return successful");
				user.smscode = rows[0].Code;
				req.session.user=user;

				res.contentType('json');
		    	res.send(JSON.stringify({ status:"Login successful" }));
		    	res.end();
			} else {
				console.log("return Failed");
				//console.log(res);
				res.status(401);
				res.contentType('json');
		    	res.send(JSON.stringify({ status:"Login Failed" }));
		    	res.end();
			}
		  }
		  else
	    	console.log('Error while performing Query.');
	});
	}catch(e)
	{
		console.log(e);
	}
};

exports.fetchCode_res = function(req, res){
	//Fetch sms code from sms server
	try{
		console.log('mobile' + req.body.mobile);
		var smscode = (Math.random()*1000000).toFixed(0);
		var sms = '【为爱吃狂】欢迎使用为爱吃狂，您的手机验证码是' + smscode + '。本条信息无需回复';
		var request = require('request');

		request.post(
			{
				url:'http://yunpian.com/v1/sms/send.json',
				form:{ apikey: "fda4d2127b5394a76d1562f91d7a304d", mobile: req.body.mobile, text: sms }},
				function (error, response, body) {
					if (!error && response.statusCode == 200) {
						console.log('send sms successful');
						res.contentType('json');
						res.send(JSON.stringify({smscode:smscode}));
						res.end();
					} else {
						console.log(error);
						res.contentType('json');
						res.status(401);
						res.send(JSON.stringify({status:"incorrect mobile number"}));
						res.end();
					}
				}
		);

		var q = pool.query('insert into usersmsverification set userid = ? , code = ? , CreatedTime = ?', [req.body.mobile, smscode, new Date()], function(err, results) {
		  if (!err && results.affectedRows !== 0){
		  	console.log('add smscode ', results.affectedRows);
		  }
		  else
		    console.log('Error while performing Query.' + err);
		});
		console.log(q.sql);
	}catch(e){
		console.log(e);
	}
};