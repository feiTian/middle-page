/*
	#createUserRequest
	#getOfferList
	#takeOffer
	#offerConfirmation
*/

mysql = require('mysql');
var pool  = require('./db').pool;

exports.createUserRequest = function(req, res){
	console.log("create user request action");
	try{
		var query = pool.query('insert into UserRequest set UserId = ?, Latitude = ?, Longitude = ?, NumberOfPeople = ?, DesiredTime = ?', [req.body.userID, req.body.latitude, req.body.longitude, req.body.numOfPeople, req.body.desiredTime], function(err, results) {
		  if (!err){

			if(results.affectedRows !== 0){
				console.log("create user request successful");
				res.contentType('json');
		    	res.send(JSON.stringify({ id: results.insertId }));
		    	res.end();
	//mock data
		
		    	var propsedOffer=[
		    					[results.insertId, 507666, 1, new Date(), new Date(), 'mm'], 
		    					[results.insertId, 507837, 1, new Date(), new Date(), 'mm']];
				var q2 = pool.query('insert into restaurantproposedoffer(RequestId, RestaurantId, DiscountId, ProposedTime, OfferExpiredTime, Comments) values ?', [propsedOffer], function(err, results) {});
				console.log(q2.sql);
			} else {
				console.log("create user request failed");
				res.contentType('json');
				res.status(401);
		    	res.send(JSON.stringify({ status:"create request failed" }));
		    	res.end();
			}
		  }
		  else
		    console.log('Error while performing Query.');
		});
	}catch(e){
		console.log(e);
	}
};

exports.getOfferList = function(req, res){

	console.log("getting offer list");
	try{
		var query = pool.query('select restaurant.Name, offer.state, offer.ProposedTime, offer.IsReservedSeat, offer.Comments, discount.Title, offer.ID, restaurant.LogoPath from restaurantproposedoffer offer, restaurant, discount where offer.RestaurantId = restaurant.ID and offer.DiscountId=discount.ID and RequestId = ?', [req.params.id], function(err, rows, fields) {
		  if (!err){
		  	console.log('The solution is: ', rows.length);
		  	console.log('result is: ', rows);
		  	

			if(rows.length !== 0){
				console.log("get offers successful");
				res.contentType('json');
		    	res.send({
		    		count: rows.length,
		    		items: rows
		    	});
		    	res.end();
			} else {
				console.log("get offers failed");
				res.contentType('json');
				res.status(401);
		    	res.send(JSON.stringify({ status:"get offers failed" }));
		    	res.end();
			}
		  }
		  else
		    console.log('Error while performing Query.');
		});
	}catch(e){
		console.log(e);
	}
};

exports.takeOffer = function(req, res){
	console.log("taking offer");
	try{
		var query = pool.query('insert into useroffertaken set UserRequestId = ?, RestaurantOfferId = ?, TakenTime = ?', [req.params.id, req.body.offerId, new Date()], function(err, results) {
		  if (!err){
		  	console.log('The solution is: ', results.affectedRows);
		  	console.log('request id is: ', results.insertId);
		  	

			if(results.affectedRows !== 0){
				console.log("take offers successful");
				res.contentType('json');
				res.send(JSON.stringify({message:"success"}));
				res.end();
			} else {
				console.log("get offers failed");
				res.contentType('json');
				res.status(401);
				res.send(JSON.stringify({ status:"take offers failed" }));
				res.end();
			}
		  }
		  else
		    console.log('Error while performing Query.');
		});
	}catch(e){
		console.log(e);
	}
};

exports.confirmOffer = function(req, res){
	try{
		var values = [];// = [[5,25,1], [5,24,3], [5,26,1]];

		for(var index in req.body.cart){
			console.log(req.body.cart[index].id);
			console.log(req.body.cart[index].quantity);
			values[index] = [req.params.id, req.body.cart[index].id, req.body.cart[index].quantity];
		}
		
		var query = pool.query('insert into userbookingorder(RequestId, MenuId, Quantity) values ?', [values], function(err, results) {
			if (!err){
			  	console.log('The solution is: ', results.affectedRows);
			  	console.log('request id is: ', results.insertId);
			  	

				if(results.affectedRows !== 0){
					console.log("take offers successful");
					res.contentType('json');
					res.send(JSON.stringify({message:"success"}));
					res.end();
				} else {
					console.log("get offers failed");
					res.contentType('json');
					res.status(401);
					res.send(JSON.stringify({ status:"take offers failed" }));
					res.end();
				}
			}else if(err.code === 'ER_NO_REFERENCED_ROW_2'){
		  		console.log("get offers failed");
				res.contentType('json');
				res.status(400);
				res.send(JSON.stringify({ status:"This offer needs preorder" }));
				res.end();
			}else
			{
			    console.log(err);
			}
		});
	}catch(e){
		console.log(e);
	}

}