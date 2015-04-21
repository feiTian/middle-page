/*
 *restaurant listening
 */
 var pool = require('./db').pool;

exports.getNearbyRestaurant = function(req, res){

 	console.log("getting nearby restaurant");
 	console.log(req.body);
 	try{
 		var sql = '';
 		if(req.query.cb_dianping == 'true'){
 			var q_dianping = 	'(SELECT deal_id, latitude latitude, longitude longitude, res_name name, address address ' +
					 			'from dp_tuangou_byres_meishi' +
								' WHERE latitude > '+req.query.south_west_lat +
								' and latitude < '+req.query.north_east_lat +
								' and longitude > '+req.query.south_west_lon +
								' and longitude < '+req.query.north_east_lon + 
								' and current_price > '+req.query.price_min +
								' and current_price < '+req.query.price_max +
								' LIMIT 50)';
 			sql = sql + q_dianping;
 		}
 		if(req.query.cb_nuomi == 'true'){
 			var q_meituan = 	'(SELECT deal_id, latitude latitude, longitude longitude, res_name name, address address ' +
					 			'from dp_nuomi_byres_meishi' +
								' WHERE latitude > '+req.query.south_west_lat +
								' and latitude < '+req.query.north_east_lat +
								' and longitude > '+req.query.south_west_lon +
								' and longitude < '+req.query.north_east_lon + 
								' and current_price > '+req.query.price_min +
								' and current_price < '+req.query.price_max +
								' LIMIT 50)';
			if(sql != ''){
				sql = sql + ' UNION ALL ';
			}
			sql = sql + q_meituan;
 		}
 		if(req.query.cb_meituan == 'true'){
 			var q_nuomi =  		'(SELECT deal_id, latitude latitude, longitude longitude, res_name name, address address ' +
					 			'from dp_meituan_byres_meishi' +
								' WHERE latitude > '+req.query.south_west_lat +
								' and latitude < '+req.query.north_east_lat +
								' and longitude > '+req.query.south_west_lon +
								' and longitude < '+req.query.north_east_lon + 
								' and current_price > '+req.query.price_min +
								' and current_price < '+req.query.price_max +
								' LIMIT 50)';
			if(sql != ''){
				sql = sql + ' UNION ALL ';
			}
			sql = sql + q_nuomi;
 		}
		console.log(req.query);
		var q = pool.query(sql, function(err, rows, fields) {
		  if (!err){
			console.log("get nearby restaurant successful");
			res.contentType('json');
	    	res.send({
				count: rows.length,
				items: rows
	    	});
			res.end();
		}
		else
			console.log('Error while performing Query.');
		});
		console.log(q.sql);
	}catch(e){
		console.log(e);
	}
};


exports.getMenuList = function(req, res){
	console.log("getting menus.");
	try{	
		pool.query('SELECT ID itemId, Name name, Price price, PicPath pic, Category category from restaurantmenu where restaurantId = ?', [req.params.restaurantID], function(err, rows, fields) {
		  	if (!err){
			  	console.log('The solution is: ', rows);

			  	if(rows.length !== 0){
					console.log("get menu of restaurant successful");
					res.contentType('json');
			    	res.send({
						count: rows.length,
						items: rows
			    	});
					res.end();
				} else {
					console.log("get menu of restaurant failed");
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
}

exports.register = function(req, res){
	console.log('registering restaurant.');
	console.log(req.body);
	try{

		var verifyCode = pool.query('select * from usersmsverification where userid = ? and code = ?', [req.body.phone, req.body.code], function(err, rows, fields) {
			if (!err){
			  	console.log('The solution is: ', rows);

			  	if(rows.length !== 0){
					console.log("verify code is OK.");
					var query = pool.query('insert into dp_restaurant_tuiguang set Name = ?, Location = ?, Contact = ?, Phone = ?, Refer_Phone = ?', [req.body.name, req.body.address, req.body.contact, req.body.phone, req.body.ref_phone], function(err, results) {
						if (!err){

							if(results.affectedRows !== 0){
								console.log("register restaurant successful");
								res.contentType('json');
						    	res.send(JSON.stringify({ id: results.insertId }));
						    	res.end();
							} else {
								console.log("register restaurant failed");
								res.contentType('json');
								res.status(401);
						    	res.send(JSON.stringify({ status:"register restaurant failed" }));
						    	res.end();
							}
						  }
						  else
						    console.log('Error while performing Query.' + err);
						});
					console.log(query.sql);
				} else {
					console.log("verify code is wrong.");
					res.contentType('json');
					res.status(401);
					res.send(JSON.stringify({ status:"code is wrong" }));
					res.end();
				}
			}
			else
				console.log('Error while performing Query.');

		})
		
		
	}catch(e){
		console.log(e);
	}
}